import {ICommand} from "./command.interface";
import {CommandExecutor} from "../command-executor";
import {MongoHelper} from "../../helpers/mongo.helper";
import {Collection} from "mongodb";
import {ReadlineHelper} from "../readline.helper";

interface BackupObject {
    dateName: string,
    collections: {
        collection: Collection,
        type: string
    }[];
}

export class Backup implements ICommand {
    private static async WrongUsage() {
        console.info('Correct usages: ');
        await CommandExecutor.ExecuteCommand("help");
    }

    private static async CopyCollection(source: Collection, target: Collection): Promise<{ inserted: number, source: number }> {
        let sourceArray = await source.find({}).toArray();
        if (sourceArray.length < 1) return {inserted: 0, source: 0};
        let result = await target.insertMany(sourceArray);
        return {inserted: result.insertedCount, source: sourceArray.length};
    }

    async Execute(args: string[] = []): Promise<boolean> {
        if (!args || args.length < 1) {
            Backup.WrongUsage();
            return true;
        }
        let backups = await this.GetBackupObjects();
        switch (args[0]) {
            case "create":
                let dateName = new Date().toDateString().replace(/ /g, '-');
                let serial = 0;
                let uniqueName: string = undefined;
                while (!uniqueName) {
                    uniqueName = dateName + '-' + serial;
                    if (backups.find(x => x.dateName == uniqueName)) {
                        uniqueName = undefined;
                        serial++
                    }
                }

                let workCollections = await MongoHelper.getCollections("Kuktadb");
                for (let collection of workCollections) {
                    let name = `${uniqueName}_${collection.collectionName}_${Math.round(Date.now() / 1000)}`;
                    let newCollection = await MongoHelper.CreateCollection("Backup", name);
                    let result = await Backup.CopyCollection(collection, newCollection);
                    console.info(`Copied ${result.inserted} of ${result.source} to ${newCollection.collectionName}`);
                }
                console.info("Backup creation complete.");
                return true;
            case "list":
                let objects = await this.GetBackupObjects();
                for (let obj of objects) {
                    let line = "Backup - " + obj.dateName + " - ";
                    let start = true;
                    obj.collections.forEach(x => {
                        if (!start)
                            line = line + ', ';
                        line = line + x.type;
                        start = false;
                    });
                    console.info(line);
                }
                return true;
            case "recover":
                if (!args[1]) {
                    Backup.WrongUsage();
                    return
                }
                let backupName = args[1];
                let backup = backups.find(x => x.dateName == backupName);
                if (!backup) {
                    console.info("Backup not found!");
                    return true;
                }

                for (let collection of backup.collections) {
                    let targetCollection = await MongoHelper.getCollection(collection.type);
                    if (!targetCollection) {
                        let result = await ReadlineHelper.Question(`Collection: ${collection.type} not exist. Create(c) or skip(S)?`);
                        if (result.toLowerCase() === 'c') {
                            targetCollection = await MongoHelper.CreateCollection('Kuktadb', collection.type);
                        } else continue;
                    }
                    let deleteResult = await targetCollection.deleteMany({});
                    console.info("Deleted: " + deleteResult.deletedCount);
                    let result = await Backup.CopyCollection(collection.collection, targetCollection);
                    console.info(`Copied ${result.inserted} of ${result.source} to ${targetCollection.collectionName}`);
                }
                console.info("Recover complete.");
                return true;
            case "delete":
                if (!args[1]) {
                    Backup.WrongUsage();
                    return
                }
                let deletingBackupName = args[1];
                let deleteBackup = backups.find(x => x.dateName == deletingBackupName);
                if (!deleteBackup) {
                    console.info("Backup not found!");
                    return true;
                }
                for (let collection of deleteBackup.collections) {
                    let targetCollection = await MongoHelper.getCollection(collection.type);
                    await collection.collection.drop();

                }
                console.info("Delete complete.");
                return true;
            default:
                Backup.WrongUsage();
                return false;
        }
    }

    GetCommandName(): string {
        return "backup";
    }

    GetUsage(): string[] {
        return [
            "- backup create | creates a manual backup with current date, and number",
            "- backup list | write the loadable backups",
            "- backup recover {name} | load the backup",
            "- backup delete {name} | load the backup"
        ];
    }

    private async GetBackupObjects(): Promise<BackupObject[]> {
        let collections = await MongoHelper.getCollections("Backup");
        let objects: BackupObject[] = [];
        for (let collection of collections) {
            let nameSegments = collection.collectionName.split('_');
            let dateName = nameSegments[0];
            let targetCollectionName = nameSegments[1];
            let timestamp = nameSegments[2];
            let object = objects.find(x => x.dateName == dateName);
            if (!object) {
                objects.push({dateName: dateName, collections: [{collection: collection, type: targetCollectionName}]});
            } else {
                object.collections.push({collection: collection, type: targetCollectionName});
            }
        }
        return objects;
    }
}
