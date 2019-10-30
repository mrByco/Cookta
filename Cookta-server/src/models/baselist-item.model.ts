import {MongoHelper} from "../helpers/mongo.helper";
import {iIngredient} from "../interfaces/iingredient";

export class BaselistItem implements iIngredient{
    private static readonly CollectionName = "Baselist";

    constructor (
        public ingredientID: string,
        public unit: string,
        public value: number,
        public sub: string
    ) {}


    public static async GetAllOfSub(sub: string){
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let documents = await collection.find({sub: sub}).toArray();
        let items: BaselistItem[] = [];
        for (let doc of documents){
            items.push(this.FromDocument(doc));
        }
        return items;
    }
    public static async SetItem(sub: string, data: iIngredient): Promise<BaselistItem>{
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let newItem = new BaselistItem(data.ingredientID, data.unit, data.value, sub);
        await collection.replaceOne({sub: sub}, newItem.ToDocument(), {upsert: true});
        return newItem;
    }
    public static async DeleteItem(sub: string, ingredientId: string): Promise<BaselistItem> {
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let itemToDelete = this.FromDocument(await collection.findOne({sub: sub, ingredientID: ingredientId}));
        if (!itemToDelete)
            return null;
        let result = await collection.deleteOne({sub: sub, ingredientID: ingredientId});
        return result.deletedCount > 0 ? itemToDelete : null;
    }

    public static FromDocument(document: any): BaselistItem {
        return new BaselistItem(
            document['ingredientID'],
            document['unit'],
            document['value'],
            document['sub']
        )
    }
    public ToDocument(): any {
        return {
            ingredientID: this.ingredientID,
            unit: this.unit,
            value: this.value,
            sub: this.sub
        }
    }
}
