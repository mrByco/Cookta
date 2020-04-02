import {IShoppingList} from "../../models/shopping-list.interface";
import {Family} from "../../models/family.model";

export interface IShoppingListService {

    GetShoppingList(family: Family, NextShoppingDate: string): Promise<IShoppingList>;
}
