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
import {SendableFood} from '../../models/food/food-sendable';

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
        let row1: IHomeRowContentMarkup = {arguments: 'lastest', big: false, type: 'special'};
        let row2: IHomeRowContentMarkup = {arguments: 'mostpopulartag-subscription', big: false, type: 'special'};
        return {row1: row1, row2: row2};
    }

    private static async GetActualRowContent(user: User, req: IHomeContentRequest): Promise<IHomeRowContent> {
        let resp: IHomeRowContent = {clickAction: 'open', foods: [], other: undefined, title: `NotFound: ${req.code} -  ${req.args}`};
        switch (req.code) {
            case 'special':
                if (req.args == 'lastest') {
                    resp.foods = await Services.FoodService.MakeRequest({published: true}, cursor => {
                        cursor.sort({uploaded: -1});
                        cursor.limit(req.count);
                        return cursor.toArray();
                    }).then(f => SendableFood.ToSendableAll(f));
                    resp.title = 'Utolsó feltöltések';
                    resp.clickAction = 'open';
                    break;
                } else if (req.args == 'mostpopulartag-subscription') {
                    resp.foods = await Services.FoodService.MakeRequest({published: true}, cursor => {
                        cursor.sort({subscriptions: -1});
                        cursor.limit(req.count);
                        return cursor.toArray();
                    }).then(f => SendableFood.ToSendableAll(f));
                    resp.title = 'Legnépszerűbb';
                    resp.clickAction = 'open';
                    break;
                }
            case 'tag':
                console.error(Error('Notimplemented - tag'));
                break;
        }
        return resp;
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
        let responses: IHomeRowContent[] = [];
        for (let req of reqBody) {
            responses.push(await HomeController.GetActualRowContent(user, req));
        }

        return responses;
    }
}
