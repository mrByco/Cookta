import {Controller} from 'waxen/dist/deorators/controller';
import {Contracts} from 'cookta-shared/src/contracts/contracts';
import {Services} from '../../Services';
import {INutrientInfo} from "cookta-shared/src/models/nutrient-info";

@Controller(Contracts.Nutrients)
export class NutrientController {
    public async GetAllNutrients(reqBody: void): Promise<INutrientInfo[]> {
        return Services.NutrientService.GetAllNutrienInfo();
    }
}
