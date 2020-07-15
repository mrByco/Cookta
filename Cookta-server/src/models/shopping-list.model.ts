import {IIngredient} from 'cookta-shared/src/models/ingredient/ingredient.interface';
import {IShoppingList} from 'cookta-shared/src/models/shopping-list/shopping-list.interface';
import {ObjectID} from 'mongodb';
import {Services} from '../Services';
import {IngredientHelper} from '../helpers/ingredient.helper';

require('../../src/extensions/date-extensions');

export class ShoppingList {

    constructor(public ShoppingTotal: IIngredient[],
                public IngredientsCompleted: { Indredient: IIngredient, ShippingSectionId: string }[],
                public IngredientsCanceled: IIngredient[],
                public FamilyId: string,
                public ShoppingUntil: number,
                public CreatedOn: number,
                public CompletedOn: number) {
    }


    public static async FromSaveShoppingList(docs: ISaveShoppingList): Promise<ShoppingList> {
        return new ShoppingList(
            await Services.ShoppingListService.GetReqList(docs.FamilyId.toHexString(), new Date(docs.ShoppingUntil).ToYYYYMMDDString()),
            docs.IngredientsCompleted,
            docs.IngredientsCanceled,
            docs.FamilyId.toHexString(),
            docs.ShoppingUntil,
            docs.CreatedOn,
            docs.CompletedOn);
    }

    public ToSaveShoppingList(): ISaveShoppingList {
        return {
            FamilyId: new ObjectID(this.FamilyId),
            IngredientsCanceled: this.IngredientsCanceled,
            IngredientsCompleted: this.IngredientsCompleted,
            ShoppingUntil: this.ShoppingUntil,
            CreatedOn: this.CreatedOn,
            CompletedOn: this.CompletedOn
        };
    }

    public async ToShoppingList(): Promise<IShoppingList> {
        return {
            FamilyId: this.FamilyId,
            IngredientsCanceled: this.IngredientsCanceled,
            IngredientsCompleted: this.IngredientsCompleted,
            IngredientsToBuy: await this.GetIngredientsToBuy()
        };
    }

    private async GetIngredientsToBuy(): Promise<IIngredient[]> {
        let Total = await IngredientHelper.ToCompleteIngredientList(this.ShoppingTotal);
        let Comlpeted = await IngredientHelper.ToCompleteIngredientList(this.IngredientsCompleted.map(i => i.Indredient));
        let Canceled = IngredientHelper.ToCompleteIngredientList(this.IngredientsCanceled);
        let TotalLeft = IngredientHelper.SubtractList(Total, IngredientHelper.MergeLists([Comlpeted, Canceled]));
        return TotalLeft
            .filter(i => i.value > 0)
            .map(i => {return {ingredientID: i.ingredientType.guid, unit: i.unit.id, value: i.value}});
    }
}

export interface ISaveShoppingList {
    IngredientsCompleted: { Indredient: IIngredient, ShippingSectionId: string }[],
    IngredientsCanceled: IIngredient[],
    FamilyId: ObjectID,
    CompletedOn: number,
    CreatedOn: number,
    ShoppingUntil: number
}
