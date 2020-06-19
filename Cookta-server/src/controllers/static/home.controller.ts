import {Contracts} from 'cookta-shared/src/contracts/contracts';
import {Controller} from 'waxen/dist/deorators/controller';
import {IHomeContentRequest} from 'cookta-shared/src/contracts/home/home-content.request';
import {IHomeRowContent} from 'cookta-shared/src/models/home/home-row-content.interface';
import {Security} from 'waxen/dist/deorators/security';
import {User} from '../../models/user.model';
import {ISquareContent} from 'cookta-shared/src/models/home/square-conent.interface';
import {Services} from '../../Services';
import {IHomeRowContentMarkup} from 'cookta-shared/src/models/home/home-row-content-markup.interface';
import {IHomeContent} from 'cookta-shared/src/models/home/home-content.interface';

require('../../extensions/date-extensions');

@Controller(Contracts.Home)
export class HomeController {
    private static async GetSquareContent(user: User): Promise<ISquareContent> {
        let last5FoodUpload = await Services.FoodService.MakeRequest({published: true, imageUploaded: {$exists: true}}, (cursor) => {
            cursor.sort({lastModified: -1});
            cursor.limit(5);
            return cursor.toArray();
        });
        let images = last5FoodUpload.map(f => {
            return {
                subtitle: `${f.name} - ${new Date(f.lastModified).ToYYYYMMDDString()}`,
                url: `https://kuktaimages.blob.core.windows.net/foodimages/${f.foodId}.jpg`
            };
        });

        return {
            title: 'Nem rég frissítve',
            clickAction: 'lastest',
            images: images,
        };
    }

    private static async GetSpecialRows(): Promise<{ row1: IHomeRowContentMarkup, row2: IHomeRowContentMarkup }> {
        return {
            row1: {type: 'special', arguments: 'lastuploads', big: false},
            row2: {type: 'special', arguments: 'weekly-most-uploaded-tag', big: false}
        };
    }

    private static async GetSpecialRowContent(): Promise<{ row1: IHomeRowContentMarkup, row2: IHomeRowContentMarkup }> {
        /* let row1 = await Services.FoodService.MakeRequest({published: true}, (cursor) => {
             cursor.sort({uploaded: -1});
         })*/
        return null;
    }

    @Security(true)
    public async GetHome(reqBody: void, user: User): Promise<IHomeContent> {
        let squareContnet = await HomeController.GetSquareContent(user);
        let specRows = await HomeController.GetSpecialRows();

        return await {
            Square: squareContnet,
            SpecRow1: specRows.row1,
            SpecRow2: specRows.row2,
            Rows: []
        };
    }

    @Security(true)
    public async GetHomeContent(reqBody: IHomeContentRequest[], user: User): Promise<IHomeRowContent[]> {
        return null;
    }
}
