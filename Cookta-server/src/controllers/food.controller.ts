import {Controller, Get, Route, Security, Tags} from "tsoa";
import {Food} from "../models/food.model";

@Tags("Food")
@Route("/food")
export class FoodController extends Controller {
    @Get()
    public async GetFoods() : Promise<Food[]> {
        try{
            return await Food.GetAllFoods();
        }
        catch{
            this.setStatus(500);
        }
    }
}
