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
import {Tag} from '../../models/tag.model';
import {RNG} from '../../random-by-seed';

require('../../extensions/date-extensions');
require('../../extensions/string-extensions');

@Controller(Contracts.Home)
export class HomeController {
    private static async GetSquareContent(user: User): Promise<ISquareContent> {
        let last5FoodUpload = await Services.FoodService.MakeRequest({
            published: true,
            imageUploaded: {$exists: true}
        }, (cursor) => {
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
        let resp: IHomeRowContent = {
            clickAction: 'open',
            foods: [],
            other: undefined,
            title: `NotFound: ${req.code} -  ${req.args}`
        };
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
                let tagId = req.args;
                resp.foods = await Services.FoodService.MakeRequest(
                    {
                        $or:
                            [{'generated.tags.guid': tagId}, {tags: tagId}],
                        published: true
                    },
                    cursor => {
                        cursor.sort({uploaded: -1});
                        cursor.limit(req.count);
                        return cursor.toArray();
                    }).then(d => SendableFood.ToSendableAll(d));
                resp.title = await Tag.GetTagById(tagId).then(t => t?.name.ToBeginUpperCase() ?? tagId);
                resp.clickAction = 'open';
                break;
        }

        return resp;
    }

    @Security(true)
    public async GetHome(reqBody: void, user: User): Promise<IHomeContent> {
        let squareContnet = await HomeController.GetSquareContent(user);
        let specRows = await HomeController.GetSpecialRows();
        let rowCount = 8;
        let rows: IHomeRowContentMarkup[] = [];
        let rowPossibilities: IHomeRowContentMarkup[] = [];

        let rng = new RNG(new Date().ToYYYYMMDDString().hashCode());

        while (rows.length < rowCount) {
            if (rowPossibilities.length == 0) rowPossibilities = await this.GetRowPossibilities();
            let choosenIndex = Math.floor(rng.NextFloat() * (rowPossibilities.length + 1));
            rows.push(rowPossibilities[choosenIndex]);
            rowPossibilities.splice(choosenIndex, 1);
            rows[rows.length - 1].big = (rows.length - 1) % 3 == 0;
        }

        return {
            Square: squareContnet,
            SpecRow1: specRows.row1,
            SpecRow2: specRows.row2,
            Rows: rows
        };
    }

    @Security(true)
    public async GetHomeContent(reqBody: IHomeContentRequest[], user: User): Promise<IHomeRowContent[]> {
        let responses: IHomeRowContent[] = [];
        let tasks = reqBody.map(req =>
            new Promise(r => {
                HomeController.GetActualRowContent(user, req)
                    .then(response => responses.push(response))
                    .then(() => r());
            }));
        await Promise.all(tasks);
        return responses;
    }

    private async GetRowPossibilities(): Promise<IHomeRowContentMarkup[]> {
        let rows: IHomeRowContentMarkup[] = [];
        let tags = (await Tag.GetAll()).filter(t => t.ischildonly == false);
        for (let tag of tags) {
            rows.push({arguments: tag.guid, big: false, type: 'tag'});
        }
        return rows;
    }
}
