
import {Family} from "../../models/family.model";
import { IShoppingList } from 'cookta-shared/src/models/shopping-list/shopping-list.interface';

export interface IShoppingListService {

    GetShoppingList(family: Family, NextShoppingDate: string): Promise<IShoppingList>;
}
