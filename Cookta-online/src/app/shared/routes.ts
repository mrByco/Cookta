export class Myclass {
  public num: number;
}


export class Routes {
  public static readonly Food = {
    GetPublicFoods: "/food",
    PostFood: "/food",
    GetCollectionFoods: "/food/collection",
    GetFoodId: "/food/{id}",
    DeleteFoodId: "/food/{id}",
    GetFoodFrom: "/food/{from}/{count}",
    PostFoodImage: "/food/image/{foodVersionId}",
    DeleteFoodImage: "/food/image/{foodVersionId}",
    GetOwnFoods: "/food/own",
    GetFamilyFoods: "/food/family",
    GetSubscriptionFoods: '/food/subscription',
    SetSubscription: '/subscription'
  };

  public static readonly IngredientType = {
    GetAll: "/ingredientType",
    SaveIngredient: "/ingredientType",
    CheckUnit: '/ingredientType/check/unit/{unitId}',
    DeleteCustomUnit: '/ingredientType/delete/unit'
  };

  public static readonly Unit = {
    GetAll: "/unit",
    GetBads: "/unit/bad-units"
  };

  public static readonly Tag = {
    GetAll: "/tag",
  };

  public static readonly User = {
    HasPermission: '/user/permission/{permission}',
    GetUser: '/user',
    SetUsername: '/user/{name}',
    CheckUsername: '/user/{name}',
  };

  public static readonly Family = {
    GetFamily: "/family/{familyId}",
    SwitchFamily: "/family/{newId}",
    DeleteFamily: "/family/{deleteId}",
    CreateFamily: "/family/{familyName}",
    InviteToFamily: "/family/{familyId}/invite",
    KickUserFromFamily: "/family/{familyId}/leave/{removeUserSub}",
  };

  public static readonly Menu = {
    GetDay: "/day/{date}",
    SetDay: "/day/{date}",
    RefreshDay: "/day/{date}/{mealingIdentity}",
    FinalizeDay: "/day/finalize/{date}/{mealingIdentity}"
  };
  public static readonly Storage = {
    GetSections: "/stock",
    CreateSection: "/stock",
    SetSection: "/stock",
    DeleteSection: "/stock/{storageSectionIdString}",

  };
  public static readonly Essentials = {
    GetEssentials: "/baselist",
    SetEssentials: "/baselist",
  };
  public static readonly Shopping = {
    GetShoppingList: "/ShoppingList/{nextShopping}",
  };
}
