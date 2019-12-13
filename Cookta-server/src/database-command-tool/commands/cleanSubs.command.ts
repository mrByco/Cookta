import {ICommand} from "./command.interface";
import {CommandExecutor} from "../command-executor";
import {MongoHelper} from "../../helpers/mongo.helper";
import {Collection, ObjectId} from "mongodb";
import {ReadlineHelper} from "../readline.helper";
import {Subscription} from "../../models/subscription.model";


export class CleanSubs implements ICommand {
    public async Execute(args: string[]): Promise<boolean> {
        //check if sub have only version reference
        let collection = await MongoHelper.getCollection(Subscription.CollectionName);
        let documents = await collection.find({}).toArray();
        let subs: Subscription[] = [];

        for (let doc of documents){
            let sub =  await Subscription.FromDocument(doc);
            if (sub == null){
                let deletedResult = await collection.deleteOne({_id: new ObjectId(doc['_id'])});
                console.log(`${deletedResult.deletedCount} document deleted!`);
                continue;
            }
            subs.push(sub);
        }
        for (let sub of subs){
            let updatedResult = await collection.replaceOne({_id: sub._id}, sub.ToDocument());
            console.log(`${updatedResult.modifiedCount} document modified!`);
        }
        console.log('Done!');
        return true;

    }

    GetCommandName(): string {
        return "cleansubs";
    }

    GetUsage(): string[] {
        return [
            "- cleansubs"
        ];
    }
}
