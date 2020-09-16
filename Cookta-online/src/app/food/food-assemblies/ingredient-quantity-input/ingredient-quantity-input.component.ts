import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {IIngredient} from '../../../shared/models/grocery/ingredient.interface';
import {BsDropdownDirective} from 'angular-bootstrap-md';
import {Unit} from '../../../shared/models/unit.interface';
import {UnitService} from '../../../shared/services/unit-service/unit.service';
import {IngredientService} from '../../../shared/services/ingredient-service/ingredient.service';

@Component({
    selector: 'app-ingredient-quantity-input',
    templateUrl: './ingredient-quantity-input.component.html',
    styleUrls: ['./ingredient-quantity-input.component.css']
})
export class IngredientQuantityInputComponent {


    public Text: string = '';
    @ViewChild('SuggestionDropDown') public SuggestionDropDown: BsDropdownDirective;
    @Output() public SaveActualEvent: EventEmitter<IIngredient> = new EventEmitter<IIngredient>();
    public availableUnits: Unit[] = [];
    private m_DefaultItem: IIngredient;
    private Actual: { value: number, unit: Unit } = {value: undefined, unit: undefined};
    private LastSavedActualString: string;

    constructor(public unitService: UnitService, public ingredientService: IngredientService) {
        this.SaveActualEvent.subscribe(() => {
                this.LastSavedActualString = JSON.stringify(this.Actual);
            }
        );
    }

    public get DefaultItem(): IIngredient {
        return this.m_DefaultItem;
    }

    @Input()
    public set DefaultItem(v) {
        this.m_DefaultItem = v;
        if (!v) {
            return;
        }
        this.refreshAvailableUnits();
        this.reparse();
    }

    private static RemoveDoubleSpaces(str: string): string {
        let workStr = str;
        while (workStr.search('  ') != -1) {
            workStr = workStr.replace('  ', ' ');
        }
        return workStr;
    }

    public Focusout() {
        this.SuggestionDropDown.hide();
    }

    TextChange(newText: string) {
        this.Text = newText;
        this.reparse();
    }

    SelectSuggestion(item: string) {
        let textParts = this.Text.split(' ');

        if (textParts.length > 1 && textParts[textParts.length - 1] != '') {
            textParts.pop();
        }
        this.Text = textParts.reduce((pre, c) => pre + c + ' ', '');
        this.Text += item;
        this.reparse();
        this.Text = IngredientQuantityInputComponent.RemoveDoubleSpaces(this.Text);
    }

    private refreshAvailableUnits() {
        this.availableUnits = this.unitService.GetAvailableUnitsFor(this.ingredientService.GetIngredient(this.DefaultItem.ingredientID));
    }

    private reparse() {
        let textParts = this.Text.toString().toLowerCase().replace(',', '.').split(' ');

        let valFound: number = undefined;
        for (let subText of textParts) {
            try {
                if (subText == '')
                    continue;
                valFound = +subText;
                break;
            } catch (e) {
                continue;
            }
        }

        this.Actual.value = valFound;
        if (!valFound)
            this.Text = '';
        this.SaveIfNeeded();
    }

    public ChangeCurrentUnit(event: Unit){
        this.Actual.unit = event;
        this.SaveIfNeeded();
    }

    public SaveIfNeeded(){
        if (JSON.stringify(this.Actual) != this.LastSavedActualString) {
            this.SaveActualEvent
                .emit(this.Actual ?
                    {
                        ingredientID: this.DefaultItem.ingredientID,
                        unit: this.Actual.unit?.id ?? this.DefaultItem.unit,
                        value: this.Actual.value
                    } :
                    undefined);
        }
    }

    GetCurrentDisplayUnit() {
        return this.unitService.GetUnit(this.Actual?.unit?.id?? this.DefaultItem.unit, this.ingredientService.GetIngredient(this.DefaultItem.ingredientID))
    }
}
