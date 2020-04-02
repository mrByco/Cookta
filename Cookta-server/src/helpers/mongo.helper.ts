import * as mongodb from "mongodb";
import {Collection, MongoClient} from "mongodb";

export class MongoHelper{
    static Client: MongoClient;

    public static connect(url: string) {
        return new Promise((resolve, reject) => {
            mongodb.MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client: mongodb.MongoClient) => {
                if (err){
                    reject(err);
                }
                else{
                    MongoHelper.Client = client;
                    resolve(client)
                }
            })
        })
    }

    public static async getCollection(name: string, db: string = "Kuktadb") {
        if (!this.Client.isConnected()) {
            return null;
        } else {
            let collections = await this.Client.db(db).collections();
            return collections.find(x => x.collectionName == name);
        }
    }

    public static async getCollections(db: string): Promise<Collection[]> {
        if (!this.Client.isConnected()) {
            return null;
        }
        else{
            return (await this.Client.db(db).collections());
        }
    }

    public static async CreateCollection(db: string, collectionName: string) {
        if (!this.Client.isConnected()) {
            return null;
        } else {
            return (await this.Client.db(db).createCollection(collectionName));
        }
    }
}
