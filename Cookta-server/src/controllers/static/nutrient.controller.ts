import {Controller} from 'waxen/dist/deorators/controller';
import {Contracts} from 'cookta-shared/src/contracts/contracts';
import {Services} from '../../Services';
import {INutrientInfo} from "cookta-shared/src/models/nutrient-info";
import {Security} from "waxen/dist/deorators/security";

@Controller(Contracts.Nutrients)
export class NutrientController {

    @Security(false, 'edit-ingredients')
    public async GetAllNutrients(reqBody: void): Promise<INutrientInfo[]> {
        return Services.NutrientService.GetAllNutrienInfo();
    }
}
