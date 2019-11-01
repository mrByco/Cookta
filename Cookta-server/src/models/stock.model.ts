import {IStockItem} from "../interfaces/istock.item";
import {MongoHelper} from "../helpers/mongo.helper";
import { ObjectID } from "mongodb";
import {ISetStockItemRequest} from "../requests/set-stock-item.request";

export class Stock {
    public static readonly CollectionName = "Stock";

    constructor (
        public owner: string,
        public items: IStockItem[],
    ){}


    public static async GetStockOfSub(sub: string): Promise<Stock>{
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let documentArray = await collection.find({sub: sub}).toArray();
        let items: IStockItem[] = [];
        for (let doc of documentArray){
            items.push({
                typeid: doc['typeid'],
                type: doc['type'],
                value: doc['value'],
                unitId: doc['unitId'],
                sub: doc['sub'],
                validitydate: doc['validitydate'],
                lastupdate: doc['lastupdate']
            })
        }
        return new Stock(sub, items);
    }

    public async Add(item: IStockItem): Promise<IStockItem>{
        item.sub = this.owner;
        item._id = undefined;
        item.lastupdate = Date.now();
        item.validitydate = Date.now();

        this.items.push(item);
        let collection = await MongoHelper.getCollection(Stock.CollectionName);
        let insertResult = await collection.insertOne(item);
        item._id = insertResult.insertedId.toHexString();
        return item;
    }
    public async Update(updateRequest: ISetStockItemRequest): Promise<IStockItem>{
        let item = this.items.find(i => i.typeid == updateRequest.typeId);
        if (item == null)
            return null;
        item.lastupdate = Date.now();

        item.value = updateRequest.value ? updateRequest.value : item.value;
        item.unitId = updateRequest.unitId ? updateRequest.unitId : item.unitId;

        let collection = await MongoHelper.getCollection(Stock.CollectionName);
        let result = await collection.replaceOne({_id: item}, item);
        return item;

    }
    public async Delete(typeId: string){
        let item = this.items.find(s => s.typeid == typeId);
        if (item)
            this.items.splice(this.items.indexOf(item));
        let collection = await MongoHelper.getCollection(Stock.CollectionName);
        await collection.deleteOne({_id: item._id});
        return item;
    }
}
