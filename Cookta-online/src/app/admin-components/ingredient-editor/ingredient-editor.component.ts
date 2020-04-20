import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {IngredientService} from "../../shared/services/ingredient-service/ingredient.service";
import {IngredientType} from "../../shared/models/grocery/ingredient-type.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {Guid} from "guid-typescript";
import {IngredientItemPopupComponent} from "./ingredient-item-popup/ingredient-item-popup.component";
import {EUnitType} from "../../shared/models/grocery/unit-type.enum";
import {DeleteCustomUnitPopupComponent} from './delete-custom-unit-popup/delete-custom-unit-popup.component';
import {Unit} from '../../shared/models/unit.interface';

@Component({
  selector: 'app-ingredient-editor',
  templateUrl: './ingredient-editor.component.html',
  styleUrls: ['./ingredient-editor.component.css']
})
export class IngredientEditorComponent implements OnInit {

  elements: MatTableDataSource<IngredientType> = new MatTableDataSource<IngredientType>();

  headElements = ['category', 'name', 'base-unit', 'custom-units', 'options'];


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild("table", {static: true}) table: MatTable<IngredientType>;
  @ViewChild(IngredientItemPopupComponent, {static: true}) editPopup: IngredientItemPopupComponent;
  @ViewChild(DeleteCustomUnitPopupComponent, {static: true}) deletePupop: DeleteCustomUnitPopupComponent;

  public set Filter(value: string){
    let filterValue = value;
    this.elements.filter = filterValue.trim().toLowerCase();

    if (this.elements.paginator) {
      this.elements.paginator.firstPage();
    }
  }
  public CurrentIngredient: IngredientType = new IngredientType("", "", "", EUnitType.volume, "", Guid.create().toString(), {cunits: []});

  constructor(private ingredientService: IngredientService) { }

  async ngOnInit() {
    let ingredients = await this.ingredientService.IngredientTypes;
    this.elements = new MatTableDataSource(ingredients);
    this.table.dataSource = this.elements;

    this.ingredientService.OnIngredientsChanged.subscribe((i) => {
      this.elements.data = i;
    });


    this.elements.paginator = this.paginator;
    this.elements.sort = this.sort;
  }
  public NewIngredientType() {
    this.OpenModalWith(new IngredientType("", "", "", EUnitType.volume, "", undefined, {cunits: []}))
  }

  OpenModalWith(row: IngredientType) {
    this.CurrentIngredient = row;
    this.editPopup.Open();
  }

  DeleteCustomUnit(unit: Unit){
    this.deletePupop.OpenUnit(unit, this.CurrentIngredient)
  }
}
