import {Tag} from "../models/tag.model";
import {SetTagRequest} from "cookta-shared/src/contracts/tags/set.tag.request";
import {Controller} from "waxen/dist/deorators/controller";
import {Contracts} from "cookta-shared/src/contracts/contracts";
import {Security} from "waxen/dist/deorators/security";
import {NotFoundError} from "../helpers/error.helper";
import {ITag} from "cookta-shared/src/models/tag/tag.interface";
import {User} from "../models/user.model";

@Controller(Contracts.Tags)
export class TagController {

    public async GetAll(reqBody: void): Promise<ITag[]> {
        return await Tag.GetAll();
    }

    @Security(false, 'manage-tags')
    public async SetTag(reqBody: SetTagRequest, user: User): Promise<ITag[]> {
        let tag;
        if (!reqBody.guid) {
            await Tag.Add(reqBody.name, reqBody.parent);
        } else {
            tag = await Tag.GetTagById(reqBody.guid);
            if (!tag) {
                throw NotFoundError();
            }
            await tag.Update(reqBody.name, reqBody.parent);
        }
        return await Tag.GetAll();
    }

    @Security(false, 'manage-tags')
    public async Delete(reqBody: void, user: User, id: string): Promise<ITag[]> {
        let tag = await Tag.GetTagById(id);
        if (!tag) {
            throw NotFoundError();
        }
        await tag.Delete();
        return await Tag.GetAll();
    }

}
