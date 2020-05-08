import {Collection, MongoClient} from "mongodb";
import {IBackupData} from "cookta-shared/src/models/backup/backup-data.interface";
import * as fs from 'fs';
import * as os from 'os';
import {Guid} from "guid-typescript";
import {getBlobsInContainer, uploadLocalFile} from "../../helpers/blobs";
require('../../extensions/date-extensions')
require('../../extensions/string-extensions')

export class BackupService {

    public readonly containerName = 'backups';

    public async Schedule(){

    }


    public async CreateBackup(client: MongoClient, databaseName: string){
        let startTime = Date.now();

        if (!client || !client.isConnected()) throw  new Error('Mongo client cannot be null and it has to be connected!');

        let database = client.db(databaseName);
        if (!database) throw new Error('Cannot get database!');

        let data = await this.GetBackupData(await database.collections());

        console.log('Backup collections collected.');
        data.collections.forEach(c => console.log(`${c.name}: ${c.items.length} item.`));

        let path = `${os.tmpdir()}\\${Guid.create().toString()}.json`;
        fs.writeFileSync(path, JSON.stringify(data), {})
        console.log(`path: ${path}`);

        await uploadLocalFile(this.containerName, path, data.name);

        let res = await getBlobsInContainer(this.containerName)
        if(!res.entries.find(b => b.name == data.name)){
            throw new Error('Could not create backup!');
        }
        fs.unlinkSync(path);

        console.info(`Backup creation time: ${Date.now() - startTime}ms`);
    }

    private async GetBackupData(collections: Collection[]): Promise<IBackupData> {
        let data: IBackupData = {name: new Date(Date.now()).ToYYYYMMDDhhmmString(), time: Date.now(), collections: []};
        for (let collection of collections){
            let items: any[] = await collection.find({}).toArray();
            data.collections.push({name: collection.collectionName, items: items});
        }
        return data;
    }
}
