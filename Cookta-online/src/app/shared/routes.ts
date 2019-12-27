export class Routes {
  public static readonly Food = {
    GetPublicFoods: "/food",
    PostFood: "/food",
    GetCollectionFoods: "/food/collection",
    GetFoodId: "/food/{id}",
    DeleteFoodId: "/food/{id}",
    GetFoodFrom: "/food/{from}/{count}",
    PostFoodImage: "/food/image/{foodVersionId}",
    DeleteFoodImage: "/food/image/{foodVersionId}"
  }
  public static readonly IngredientType = {
    GetAll: "/ingredientType",

  }
  public static readonly Unit = {
    GetAll: "/unit",

  };
  public static readonly Tag = {
    GetAll: "/tag",

  }

}
