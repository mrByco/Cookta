import {Api} from 'waxen/dist/deorators/api';
import {Contracts} from '../../../../Cookta-shared/src/contracts/contracts';
import {IHttpCaller} from "waxen/dist/client/IHttpCaller";
import { ITag } from "../../../../Cookta-shared/src/models/tag/tag.interface";
import { SetTagRequest } from "../../../../Cookta-shared/src/contracts/tags/set.tag.request";

@Api(Contracts.Tags)
export class TagApi {
    /** <=== Autogenerated callable endpoint ===> */
    public async GetAll(client: IHttpCaller): Promise<ITag[]> {
        return new Promise<ITag[]>(async (resolve) => {
            const response = await client.GET('/tag');
            response.subscribe(data => {
                resolve(data as ITag[])
            }, (err) => {
                console.error(err);
                resolve(undefined);
            });
        });
    }

    /** <=== Autogenerated callable endpoint ===> */
    public async SetTag(client: IHttpCaller, body: SetTagRequest): Promise<ITag[]> {
        return new Promise<ITag[]>(async (resolve) => {
            const response = await client.POST('/tag', body);
            response.subscribe(data => {
                resolve(data as ITag[])
            }, (err) => {
                console.error(err);
                resolve(undefined);
            });
        });
    }

    /** <=== Autogenerated callable endpoint ===> */
    public async Delete(client: IHttpCaller, id: string): Promise<ITag[]> {
        return new Promise<ITag[]>(async (resolve) => {
            const response = await client.DELETE('/tag/' + `${id}`);
            response.subscribe(data => {
                resolve(data as ITag[])
            }, (err) => {
                console.error(err);
                resolve(undefined);
            });
        });
    }
}