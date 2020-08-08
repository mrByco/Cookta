import {Controller} from 'waxen/dist/deorators/controller';
import {Contracts} from 'cookta-shared/src/contracts/contracts';
import {Services} from '../../Services';
import {INutrientInfo} from 'cookta-shared/src/models/nutrient-info';
import {Security} from 'waxen/dist/deorators/security';
import {User} from '../../models/user.model';

@Controller(Contracts.Nutrients)
export class NutrientController {

    @Security(false, 'edit-ingredients')
    public async GetAllNutrients(reqBody: void, user: User): Promise<INutrientInfo[]> {
        return Services.NutrientService.GetAllNutrienInfo();
    }
}
