import {Component, OnInit} from '@angular/core';
import {StorageSection} from 'src/app/shared/models/storage/storage-section.model';
import {IIngredientType} from "../../shared/models/grocery/ingredient-type.interface";
import {StorageService} from "../../shared/services/storage.service";
import {IngredientService} from "../../shared/services/ingredient-service/ingredient.service";
import {IIngredient} from "../../shared/models/grocery/ingredient.interface";

interface ICheckListItem {
    storage: StorageSection,
    ingredientType: IIngredientType,
    finalQuantity?: { unitId: string, value: number }
}

@Component({
    selector: 'app-stocker',
    templateUrl: './stocker.component.html',
    styleUrls: ['./stocker.component.css']
})
export class StockerComponent implements OnInit {
    Loading: boolean = false;

    public process: number = 0;
    public CheckList: {
        checkItems: ICheckListItem[], totalCheckCount: number
    };
    private StartTime: number;

    GetTimeLeftMonutes(): number {
        let timePerItem: number = (Date.now() - this.StartTime) / (this.CheckList.totalCheckCount - this.CheckList.checkItems.length);
        return Math.floor(timePerItem * (this.CheckList.checkItems.length) / 1000 / 60) + 1;
    }


    constructor(public storageService: StorageService, public ingredientService: IngredientService) {
    }

    ngOnInit(): void {
        this.CreateAndExecuteCheckExistingCheckList();
    }

    GetLeftPercent() {
        return Math.floor(100 - 100 * this.CheckList.checkItems.length / this.CheckList.totalCheckCount)
    }

    GetDefaultIngredient(item: { storage: StorageSection; ingredientType: IIngredientType }): IIngredient {
        let existing = item.storage.Items.find(i => i.ingredientID == item.ingredientType.guid);
        return existing;
    }

    ChangeCheckListItem(item: ICheckListItem, actual: IIngredient) {
        item.finalQuantity = actual ? {unitId: actual.unit, value: actual.value} : undefined;
    }

    CompleteCheckListItem(Item: ICheckListItem) {
        if (!Item.storage) return;
        if (Item.finalQuantity){
            let inStorageIndex = Item.storage.Items.findIndex(i => i.ingredientID == Item.ingredientType.guid);
            Item.storage.Items[inStorageIndex] = {ingredientID: Item.ingredientType.guid, value: Item.finalQuantity.value, unit: Item.finalQuantity.unitId}
            this.storageService.ApplyChangeOnRemote({Id: Item.storage.Id, Items: Item.storage.Items})
        }
        let ItemIndexInCheckList = this.CheckList.checkItems.indexOf(Item);
        this.CheckList.checkItems.splice(ItemIndexInCheckList, 1);
        this.process = 1 - this.CheckList.checkItems.length / this.CheckList.totalCheckCount;
    }

    private async CreateAndExecuteCheckExistingCheckList() {
        this.Loading = true;
        let checkItems: ICheckListItem[] = [];
        await this.storageService.RefreshStorageSections();
        for (let storageSection of this.storageService.Sections) {
            checkItems.push(...storageSection.Items.map(i => {
                return {storage: storageSection, ingredientType: this.ingredientService.GetIngredient(i.ingredientID)}
            }));
        }
        this.CheckList = {checkItems: checkItems, totalCheckCount: checkItems.length}
        this.Loading = false;
        this.StartTime = Date.now();
    }
}
