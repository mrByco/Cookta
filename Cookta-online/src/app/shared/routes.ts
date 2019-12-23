export class Routes {
  public static readonly Food = {
    GetFood: "/food",
    PostFood: "/food",
    GetFoodId: "/food/{id}",
    DeleteFoodId: "/food/{id}",
    GetFoodFrom: "/food/{from}/{count}",
    PostFoodImage: "/food/image/{foodVersionId}",
    DeleteFoodImage: "/food/image/{foodVersionId}"
  }

}
