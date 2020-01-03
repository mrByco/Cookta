import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {IngredientService} from "../../shared/services/ingredient.service";
import {IngredientType} from "../../shared/models/grocery/ingredient-type.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {Guid} from "guid-typescript";
import {IngredientItemPopupComponent} from "./ingredient-item-popup/ingredient-item-popup.component";

@Component({
  selector: 'app-ingredient-editor',
  templateUrl: './ingredient-editor.component.html',
  styleUrls: ['./ingredient-editor.component.css']
})
export class IngredientEditorComponent implements OnInit, AfterViewInit {

  elements: MatTableDataSource<IngredientType> = new MatTableDataSource<IngredientType>();

  headElements = ['category', 'name', 'base-unit', 'custom-units', 'options'];


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild("table", {static: true}) table: MatTable<IngredientType>;
  @ViewChild(IngredientItemPopupComponent, {static: true}) popup: IngredientItemPopupComponent;

  private Filter: string = "";
  private CurrentIngredient: IngredientType = new IngredientType("", "", "", false, false, true,  "", Guid.create().toString(), {cunits: []});

  constructor(private ingredientService: IngredientService) { }

  async ngOnInit() {
    let ingredients = await this.ingredientService.IngredientTypes;
    this.elements = new MatTableDataSource(ingredients);
    this.table.dataSource = this.elements;


    this.elements.paginator = this.paginator;
    this.elements.sort = this.sort;
  }

  ngAfterViewInit() {

  }

  applyFilter() {
    let filterValue = this.Filter;
    this.elements.filter = filterValue.trim().toLowerCase();


    if (this.elements.paginator) {
      this.elements.paginator.firstPage();
    }
  }

  OpenModalWith(row: IngredientType) {
    this.CurrentIngredient = row;
    this.popup.Open();
  }
}
