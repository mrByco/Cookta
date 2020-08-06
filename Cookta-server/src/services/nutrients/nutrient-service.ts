import {Collection} from "mongodb";
import {INutrientInfo} from "cookta-shared/src/models/nutrient-info";

export class NutrientService {
    constructor(private collection: Collection) {

    }


    async GetAllNutrienInfo(): Promise<INutrientInfo[]>{
        return (await this.collection.find().toArray()) as INutrientInfo[];
    }
}
