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
    SetSubscription: '/subscription'
  };
  public static readonly IngredientType = {
    GetAll: "/ingredientType",
    SaveIngredient: "/ingredientType"
  };

  public static readonly Unit = {
    GetAll: "/unit",
  };

  public static readonly Tag = {
    GetAll: "/tag",
  };


  public static readonly User = {
    HasPermission: "/user/permission/{permission}",
    GetUser: "/user",
  };

  public static readonly Family = {

  }
}
