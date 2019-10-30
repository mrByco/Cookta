import {iUnit} from "../interfaces/iunit";
import {MongoHelper} from "../helpers/mongo.helper";
import {ISetIngredientTypeRequest} from "../requests/set.ingredient-type.request";
import {Guid} from "guid-typescript";

export class IngredientType {

    private static readonly CollectionName = "Ingredients";
    constructor(
        public category: string = 'Default',
        public name: string = 'UnitName',
        public baseUnit: string,
        public volumeEnabled: boolean,
        public countEnabled: boolean,
        public massEnabled: boolean,
        public inshopping: string,
        public guid: string,
        public options: {cunits: iUnit[]}
    ){}

    public static async GetAllTypes(): Promise<IngredientType[]> {
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let documents = await collection.find({}).toArray();
        let types: IngredientType[] = [];
        for (let doc of documents){
            types.push(this.FromDocument(doc));
        }
        return types;
    }
    public static async SetIngredientType(request: ISetIngredientTypeRequest): Promise<IngredientType>{
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let allExisting = await this.GetAllTypes();
        let guid: Guid = undefined;
        while (!guid){
            guid = Guid.create();
            if (allExisting.find(e => e.guid == guid.toString()))
                guid = undefined;
        }
        let ingredientType = new IngredientType(
            request.category,
            request.name,
            request.baseUnit,
            request.volumeEnabled,
            request.countEnabled,
            request.massEnabled,
            request.inshopping,
            guid.toString(),
            request.options);
        await collection.replaceOne({guid: ingredientType.guid}, ingredientType.ToDocument(), {upsert: true});
        return ingredientType;
    }
    public static async DeleteIngredientType(guid: string): Promise<boolean>{
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let result = await collection.deleteOne({guid: guid});
        return result.deletedCount > 0;
    }

    private static FromDocument(doc: any): IngredientType {
        return new IngredientType (
            doc['category'],
            doc['name'],
            doc['base-unit'],
            doc['volume-enabled'],
            doc['count-enabled'],
            doc['mass-enabled'],
            doc['inshopping'],
            doc['guid'],
            doc['options']
        )
    }
    private ToDocument(): any {
        let doc = {
            category: this.category,
            name: this.name,
            inshopping: this.inshopping,
            guid: this.guid,
            options: this.options,
        };
        doc['base-unit'] = this.baseUnit;
        doc['volume-enabled'] = this.volumeEnabled;
        doc['count-enabled'] = this.countEnabled;
        doc['mass-enabled'] = this.massEnabled;
        return doc;
    }
}
