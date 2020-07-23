import {IIngredient} from 'cookta-shared/src/models/ingredient/ingredient.interface';
import {ICompletedShoppingItem, IShoppingList} from 'cookta-shared/src/models/shopping-list/shopping-list.interface';
import {ObjectID} from 'mongodb';
import {Services} from '../Services';
import {IngredientHelper} from '../helpers/ingredient.helper';

require('../../src/extensions/date-extensions');

export class ShoppingList {

    constructor(public id: ObjectID,
                public ShoppingTotal: IIngredient[],
                public IngredientsCompleted: ICompletedShoppingItem[],
                public IngredientsCanceled: IIngredient[],
                public FamilyId: string,
                public ShoppingTo: number,
                public CreatedOn: number,
                public CompletedOn: number,
                public ShoppingFrom: number) {
    }


    public static async FromSaveShoppingList(docs: ISaveShoppingList): Promise<ShoppingList> {
        return new ShoppingList(
            docs._id,
            await Services.ShoppingListService.GetReqList(docs.FamilyId.toHexString(),
                docs.ShoppingFrom ? new Date(docs.ShoppingFrom).ToYYYYMMDDString() : new Date(Date.now()).ToYYYYMMDDString(),
                new Date(docs.ShoppingUntil).ToYYYYMMDDString()),
            docs.IngredientsCompleted,
            docs.IngredientsCanceled,
            docs.FamilyId.toHexString(),
            docs.ShoppingUntil,
            docs.CreatedOn,
            docs.CompletedOn,
            docs.ShoppingFrom);
    }

    public ToSaveShoppingList(): ISaveShoppingList {
        return {
            _id: this.id,
            FamilyId: new ObjectID(this.FamilyId),
            IngredientsCanceled: this.IngredientsCanceled,
            IngredientsCompleted: this.IngredientsCompleted,
            ShoppingUntil: this.ShoppingTo,
            CreatedOn: this.CreatedOn,
            CompletedOn: this.CompletedOn,
            ShoppingFrom: this.ShoppingFrom,
        };
    }

    public async ToSharedShoppingList(): Promise<IShoppingList> {
        return {
            FamilyId: this.FamilyId,
            IngredientsCanceled: this.IngredientsCanceled,
            IngredientsCompleted: this.IngredientsCompleted,
            IngredientsToBuy: await this.GetIngredientsToBuy(),
            CreatedOn: this.CreatedOn,
            ShoppingFrom: this.ShoppingFrom,
            ShoppingTo: this.ShoppingTo
        };
    }

    public async SetFromTo(from: Date, to: Date){
        if (from.getTime() > to.getTime()) return;
        this.ShoppingFrom = from.getTime();
        this.ShoppingTo = to.getTime();
        this.ShoppingTotal = await Services.ShoppingListService.GetReqList(this.FamilyId,
            from.ToYYYYMMDDString(),
            to.ToYYYYMMDDString());
    }

    public async GetIngredientsToBuy(): Promise<IIngredient[]> {
        let Total = await IngredientHelper.ToCompleteIngredientList(this.ShoppingTotal);
        let Comlpeted = await IngredientHelper.ToCompleteIngredientList(this.IngredientsCompleted.map(i => i.Ingredient));
        let Canceled = IngredientHelper.ToCompleteIngredientList(this.IngredientsCanceled);
        let TotalLeft = IngredientHelper.SubtractList(Total, IngredientHelper.MergeLists([Comlpeted, Canceled]));
        return TotalLeft
            .filter(i => i.value > 0)
            .map(i => {
                return {ingredientID: i.ingredientType.guid, unit: i.unit.id, value: i.value}
            });
    }
}

export interface ISaveShoppingList {
    _id: ObjectID,
    IngredientsCompleted: ICompletedShoppingItem[],
    IngredientsCanceled: IIngredient[],
    FamilyId: ObjectID,
    CompletedOn: number,
    CreatedOn: number,
    ShoppingUntil: number,
    ShoppingFrom: number,
}
