import {User} from '../../models/user.model';
import {Services} from '../../Services';
import {ObjectId} from 'mongodb';
import {Controller} from 'waxen/dist/deorators/controller';
import {Contracts} from 'cookta-shared/src/contracts/contracts';
import {Security} from 'waxen/dist/deorators/security';
import {NotFoundError} from '../../helpers/error.helper';
import {IStorageSection} from 'cookta-shared/src/models/storage-sections/storage-section.interface';
import {IStorageItemChangeRequest} from 'cookta-shared/src/contracts/stock/StorageItemChange.request';
import {IStorageSectionRequest} from 'cookta-shared/src/contracts/stock/IStorageSectionRequest';

@Controller(Contracts.Storage)
export class StockController {

    @Security(false)
    public async GetAll(reqBody: void, user: User): Promise<any> {
        let items = await Services.StorageService.GetSections(user.GetCurrentFamily().Id.toHexString());
        return Services.ToSendableList(items);
    }

    @Security(false)
    public async CreateSection(reqBody: void, user: User): Promise<IStorageSection> {
        return await Services.StorageService.CreateSection(user.GetCurrentFamily().Id.toHexString()).ToSendJson();
    }

    @Security(false)
    public async EditSection(reqBody: IStorageItemChangeRequest, user: User): Promise<IStorageSectionRequest> {
        return Services.StorageService.SetSection(user, reqBody).ToSendJson();
    }

    @Security(false)
    public async DeleteSection(reqBody: void, user: User, sectionIdString: string): Promise<IStorageSection[]> {
        let sectionId;
        try {
            sectionId = new ObjectId(sectionIdString);
        } catch{
            throw NotFoundError();
        }
        await Services.StorageService.DeleteSection(user, sectionId);
        return Services.ToSendableList(Services.StorageService.GetSections(user.GetCurrentFamily().Id.toHexString()));
    }
}

