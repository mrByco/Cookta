import { Component, OnInit } from '@angular/core';
import {ShoppingService} from '~/services/shopping/shopping.service';

@Component({
  selector: 'ns-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  constructor(private shoppingListService: ShoppingService) { }

  ngOnInit(): void {
  }

}
