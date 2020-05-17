import {ICollectionData} from "./collection-data/collection-data.interface";

export interface IBackupData {
    time: number;
    name: string;
    collections: ICollectionData[];
}
