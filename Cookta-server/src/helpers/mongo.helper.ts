import * as mongodb from "mongodb";
import {MongoClient} from "mongodb";

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
    public static async getCollection(name: string){
        if (!this.Client.isConnected()) {
            return null;
        }
        else{
            return (await this.Client.db("CoffeeDB").collection(name));
        }
    }
    public static checkIdIsValid(Id: string): boolean {
        let checkForValidId = new RegExp("^[0-9a-fA-F]{24}$");
        return checkForValidId.test(Id);
    }
}