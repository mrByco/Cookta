import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ICompletedShoppingItem} from '../../../../../../Cookta-shared/src/models/shopping-list/shopping-list.interface';
import {UnitService} from 'src/app/shared/services/unit-service/unit.service';
import {IngredientService} from '../../../shared/services/ingredient-service/ingredient.service';
import {Unit} from "../../../shared/models/unit.interface";
import {BsDropdownDirective} from "angular-bootstrap-md";

@Component({
    selector: 'app-shopping-quantity-box',
    templateUrl: './shopping-quantity-box.component.html',
    styleUrls: ['./shopping-quantity-box.component.css']
})
export class ShoppingQuantityBoxComponent implements OnInit {
    public Text: string = '';
    public filteredSuggestions: string[];

    @ViewChild('SuggestionDropDown') public SuggestionDropDown: BsDropdownDirective;

    private m_Item: ICompletedShoppingItem;
    private availableUnits: Unit[] = [];
    private highlightedSugg: string;

    constructor(public unitService: UnitService, public ingredientService: IngredientService) {
    }

    get Item() {
        return this.m_Item;
    }

    @Input()
    set Item(v) {
        this.m_Item = v;
        this.refreshAvailableUnits();
        this.reparse();
        this.refilter();
    }

    ngOnInit(): void {
    }

    TextChange(newText: string) {
        this.Text = newText;
        this.reparse();
        this.refilter();
    }

    SelectSuggestion(item: string) {
        let textParts = this.Text.split(' ');

        if (textParts.length > 1 && textParts[textParts.length - 1] != '')
            textParts.pop();
        this.Text = textParts.reduce((pre, c) => pre + c + ' ', '');
        console.log(this.Text);
        this.Text += item;
        this.reparse();
        this.refilter();
        this.Text = ShoppingQuantityBoxComponent.RemoveDoubleSpaces(this.Text);
    }

    public refilter() {
        if (this.Item.Bought) this.filteredSuggestions = [];
        else this.filteredSuggestions = this.availableUnits.map(u => u.name);

        if (this.filteredSuggestions.length > 0 && !this.Item.Bought)
            this.SuggestionDropDown?.show();
        else
            this.SuggestionDropDown?.hide();

    }

    private refreshAvailableUnits() {
        this.availableUnits = this.unitService.GetAvailableUnitsFor(this.ingredientService.GetIngredient(this.Item.Ingredient.ingredientID));
    }

    private reparse() {
        let text = this.Text.toLowerCase();

        let unitFound: Unit;
        for (let unit of this.availableUnits) {
            let i = text.search(unit.name.toLowerCase());
            if (i != -1) {
                text.replace(unit.name.toLowerCase(), '');
                unitFound = unit;
                break;
            }
        }

        let valFound: number;
        for (let subText of text.split(' ')) {
            try {
                valFound = +subText;
                break;
            } catch (e) {
                continue;
            }
        }

        if (unitFound && valFound)
            this.Item.Bought = {UnitId: unitFound.id, Value: valFound};
        else
            this.Item.Bought = undefined;
    }


    private static RemoveDoubleSpaces(str: string): string {
        let workStr = str;
        while (workStr.search('  ') != -1){
            workStr = workStr.replace('  ', ' ');
        }
        return workStr;
    }
}
