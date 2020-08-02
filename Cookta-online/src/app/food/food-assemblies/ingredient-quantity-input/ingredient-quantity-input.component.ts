import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {IIngredient} from "../../../shared/models/grocery/ingredient.interface";
import {BsDropdownDirective} from "angular-bootstrap-md";
import {Unit} from "../../../shared/models/unit.interface";
import {UnitService} from "../../../shared/services/unit-service/unit.service";
import {IngredientService} from "../../../shared/services/ingredient-service/ingredient.service";

@Component({
    selector: 'app-ingredient-quantity-input',
    templateUrl: './ingredient-quantity-input.component.html',
    styleUrls: ['./ingredient-quantity-input.component.css']
})
export class IngredientQuantityInputComponent {


    public Text: string = '';
    public filteredSuggestions: string[];

    public Focusin() {
        this.ClickedIn = true;
        this.refilter();
    }
    public Focusout() {
        this.ClickedIn = false;
        this.SuggestionDropDown.hide()
    }
    public ClickedIn: boolean = false;

    @ViewChild('SuggestionDropDown') public SuggestionDropDown: BsDropdownDirective;
    @Output() public OnActualChanged: EventEmitter<IIngredient> = new EventEmitter<IIngredient>();
    private availableUnits: Unit[] = [];
    private m_DefaultItem: IIngredient;
    private Actual: { value: number, unit: Unit };

    constructor(public unitService: UnitService, public ingredientService: IngredientService) {
    }

    public get DefaultItem(): IIngredient {
        return this.m_DefaultItem;
    }

    @Input()
    public set DefaultItem(v) {
        this.m_DefaultItem = v
        if (!v) return;
        this.refreshAvailableUnits();
        this.reparse();
        this.refilter();
    }

    private static RemoveDoubleSpaces(str: string): string {
        let workStr = str;
        while (workStr.search('  ') != -1) {
            workStr = workStr.replace('  ', ' ');
        }
        return workStr;
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
        this.Text += item;
        this.reparse();
        this.refilter();
        this.Text = IngredientQuantityInputComponent.RemoveDoubleSpaces(this.Text);
    }

    public refilter() {
        if (this.Actual) this.filteredSuggestions = [];
        else this.filteredSuggestions = this.availableUnits.map(u => u.name);

        if (this.filteredSuggestions.length > 0 && !this.Actual && this.ClickedIn && this.Text.length > 0)
            this.SuggestionDropDown?.show();
        else
            this.SuggestionDropDown?.hide();

    }

    private refreshAvailableUnits() {
        this.availableUnits = this.unitService.GetAvailableUnitsFor(this.ingredientService.GetIngredient(this.DefaultItem.ingredientID));
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

        let oldActualString = JSON.stringify(this.Actual);

        if (unitFound && valFound)
            this.Actual = {unit: unitFound, value: valFound};
        else
            this.Actual = undefined;


        if (JSON.stringify(this.Actual) != oldActualString) {
            this.OnActualChanged
                .emit(this.Actual ?
                    {ingredientID: this.DefaultItem.ingredientID, unit: this.Actual.unit.id, value: this.Actual.value} :
                    undefined);
        }
    }


}
