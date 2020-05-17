import {ICommand} from "./command.interface";
import {CommandExecutor} from "../command-executor";
import {MongoHelper} from "../../helpers/mongo.helper";
import {ReadlineHelper} from "../readline.helper";
import {ICollectionData} from "cookta-shared/src/models/backup/collection-data/collection-data.interface";
import * as fs from 'fs';
import {IBackupData} from "cookta-shared/src/models/backup/backup-data.interface";
import { ObjectID } from 'mongodb';

export class RestoreByFile implements ICommand {
    public static readonly CommandName = "restore-by-file";

    public async Execute(args: string[]): Promise<boolean> {
        if (args.length != 1)
            return false;
        let data: IBackupData;
        try {
            data = await new Promise<IBackupData>((resolve, reject) => {
                fs.readFile(args[0], 'utf8', (err, data) => {
                    if (err) reject(err);
                    try {
                        resolve(JSON.parse(data) as IBackupData);
                    }
                    catch (error) {
                        reject(error);
                    }
                })
            });
        }catch (error) {
            console.log('Cant read or parse file. Error: ')
            console.error(error);
            return false;
        }
        if (!data) return false;
        console.log(`Restoring: ${data.name}`)
        await this.restoreCollections(data.collections);
        return true;
    }

    private async restoreCollections(collections: ICollectionData[]) {

        for (let collection of collections) {
            let targetCollection = await MongoHelper.getCollection(collection.name);
            if (!targetCollection) {
                let result = await ReadlineHelper.Question(`Collection: ${collection.name} not exist. Create(c) or skip(S)?`);
                if (result.toLowerCase() === 'c') {
                    targetCollection = await MongoHelper.CreateCollection('Kuktadb', collection.name);
                } else continue;
            }
            let deleteResult = await targetCollection.deleteMany({});
            console.info("Deleted: " + deleteResult.deletedCount);
            if (collection.items.length > 0){
                let result = await targetCollection.insertMany(collection.items.map(value => {return {...value, ...{_id: new ObjectID(value._id)}}; }));
                console.info(`Copied ${result.insertedCount} to ${targetCollection.collectionName}`);
            }else {
                console.info(collection.name  + 'is empty in the backup.')
            }
        }
        console.info("Recover complete.");
    }

    GetCommandName(): string {
        return RestoreByFile.CommandName;
    }

    GetUsage(): string[] {
        return [
            '- restore-by-file [path]',
        ];
    }

}
