import {IUnit} from "./unit.interface";
import {MongoHelper} from "../../helpers/mongo.helper";
import {EUnitType} from "../../enums/unit-type.enum";

export class Unit implements IUnit {
    private static readonly CollectionName =  "Units";

    constructor (
        public type: EUnitType,
        public name: string,
        public shortname: string,
        public tobase: number,
        public id: string,
    ) {}

    public static async GetAll(): Promise<Unit[]> {
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let documents = await collection.find({}).toArray();
        let units: Unit[] = [];
        for (let doc of documents){
            units.push(Unit.FromDocument(doc));
        }
        return units;
    }


    private static FromDocument(doc: any): Unit {
        return new Unit(
            doc['type'],
            doc['name'],
            doc['shortname'],
            doc['tobase'],
            doc['id'],
        )
    }
    private ToDocument(): any {
        return {
            type: this.type,
            name: this.name,
            shortname: this.shortname,
            tobase: this.tobase,
            id: this.id
        };
    }
}
