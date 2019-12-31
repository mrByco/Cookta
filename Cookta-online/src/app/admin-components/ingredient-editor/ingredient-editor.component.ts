import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MdbTableDirective, MdbTablePaginationComponent} from "angular-bootstrap-md";
import {IngredientService} from "../../shared/services/ingredient.service";
import {IngredientType} from "../../shared/models/grocery/ingredient-type.model";

@Component({
  selector: 'app-ingredient-editor',
  templateUrl: './ingredient-editor.component.html',
  styleUrls: ['./ingredient-editor.component.css']
})
export class IngredientEditorComponent implements OnInit, AfterViewInit {
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective
  elements: IngredientType[] = [];
  previous: IngredientType[] = [];
  headElements = ['Kategória', 'Név', 'Alap egység', 'Egyéni mértékegységek', 'Opciók'];

  constructor(private ingredientService: IngredientService) { }

  async ngOnInit() {
    let ingredients = await this.ingredientService.IngredientTypes;
    this.elements = ingredients;

    this.mdbTable.setDataSource(this.elements);
    this.elements = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(20);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
  }
}
