import {Component, Input, OnInit} from '@angular/core';
import {ICompletedShoppingItem} from '../../../../../../Cookta-shared/src/models/shopping-list/shopping-list.interface';
import {UnitService} from 'src/app/shared/services/unit-service/unit.service';
import {IngredientService} from '../../../shared/services/ingredient-service/ingredient.service';
import {ShoppingService} from "../../../shared/services/shopping-service/shopping.service";
import {IIngredient} from "../../../shared/models/grocery/ingredient.interface";

@Component({
    selector: 'app-shopping-quantity-box',
    templateUrl: './shopping-quantity-box.component.html',
    styleUrls: ['./shopping-quantity-box.component.css']
})
export class ShoppingQuantityBoxComponent implements OnInit {
    public CurrentSaveTask: Promise<void>;
    public NextSaveTask: Promise<void>;

    private m_Item: ICompletedShoppingItem;

    constructor(public unitService: UnitService, public ingredientService: IngredientService, public shoppingService: ShoppingService) {
    }

    get Item() {
        return this.m_Item;
    }

    @Input()
    set Item(v) {
        this.m_Item = v;
    }

    ngOnInit(): void {
    }

    private SaveOrAddToSaveOrder(stateCopy: ICompletedShoppingItem){
        if (!this.CurrentSaveTask){
            this.CurrentSaveTask = this.shoppingService.SaveCompletedQuantity(stateCopy);
            this.ShiftSave()
        }
        else {
            this.NextSaveTask = this.shoppingService.SaveCompletedQuantity(stateCopy);
        }
    }

    private async ShiftSave(){
        await this.CurrentSaveTask;
        if (this.NextSaveTask){
            this.CurrentSaveTask = this.NextSaveTask;
            this.NextSaveTask = undefined;
            this.ShiftSave();
        }
    }


    OnActualChanged(item: IIngredient) {
        if (JSON.stringify(this.Item.Bought) != JSON.stringify(item ? {UnitId: item.unit, Value: item.value} : undefined)){
            console.log('Save');
            this.Item.Bought = item ? {UnitId: item.unit, Value: item.value} : undefined
            this.SaveOrAddToSaveOrder(this.Item)
        }
    }
}
