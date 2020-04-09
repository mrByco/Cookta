import {IngredientType} from "../../models/ingredient-type/ingredient-type.model";
import {IIngredientTypeService} from "./ingredient-type.service.interface";
import {IIngredientType} from "../../models/ingredient-type/ingredient-type.interface";
import {ISetIngredientTypeRequest} from "../../requests/set.ingredient-type.request";
import {MongoHelper} from "../../helpers/mongo.helper";
import {Guid} from "guid-typescript";
import { ObjectId } from "mongodb";
import {StoreService} from "atomik/lib/store-service/store-service";
import {IFieldConverter} from "atomik/lib/store-item/field.converter.interface";

export class IngredientTypeService extends StoreService<IngredientType> implements IIngredientTypeService {

    private readonly returnSame: (any) => any = (d) => d;

    public Converters: IFieldConverter[] = [
        { DatabaseFieldName: "volume-enabled", ClassFieldName: 'volumeEnabled', Convert: this.returnSame, ConvertBack: this.returnSame },
        { DatabaseFieldName: "mass-enabled", ClassFieldName: 'massEnabled', Convert: this.returnSame, ConvertBack: this.returnSame },
        { DatabaseFieldName: "count-enabled", ClassFieldName: 'countEnabled', Convert: this.returnSame, ConvertBack: this.returnSame },
    ]

    DeleteIngredientType(guid: string): boolean {
        let item = this.Items.find(i => i.guid);
        if (!item)
            return false;
        item.arhived = true;
        this.SaveItem(item);
        return true;
    }

    GetAllNotArhived(): IIngredientType[] {
        return this.FindAll(i => i.arhived != true);
    }

    SetIngredientType(request: ISetIngredientTypeRequest): IngredientType {
        let guid: Guid = request.guid ? Guid.parse(request.guid) : undefined;
        while (!guid) {
            guid = Guid.create();
            if (this.Items.find(e => e.guid == guid.toString()))
                guid = undefined;
        }
        let currentItem = this.FindOne(i => i.guid == guid.toString());
        if (!currentItem){
            currentItem = this.CreateItem(new ObjectId());
        }
        currentItem.category = request.category;
        currentItem.name = request.name;
        currentItem.volumeEnabled = request.volumeEnabled;
        currentItem.countEnabled = request.countEnabled;
        currentItem.massEnabled = request.massEnabled;
        currentItem.guid = guid.toString();
        currentItem.options = request.options;
        this.SaveItem(currentItem);
        return currentItem;
    }

    public async Start(): Promise<void> {
        let collection = MongoHelper.getCollection("Ingredients");
        let FindFood;
        let start = await super.Start();
    }

    protected FromSaveJson(doc: any): IngredientType {
        let ingType = super.FromSaveJson(doc);
        if (ingType.options == null) ingType.options = {cunits: []};
        return ingType;

    }

}
