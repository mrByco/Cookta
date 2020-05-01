import {IRoute} from "waxen/dist/abstract/route.interface";
import {ISendableFood} from "../../models/food/food-sendable.interface";
import {ERouteMethod} from "waxen/dist/route-method.enum";
import {IUpdateFoodRequest} from "./update-food.request";
import {ControllerData} from "waxen/dist/abstract/controller.interface";


//Unsecured
export const GetPublicFoods: IRoute<void, ISendableFood[], void> = {method: ERouteMethod.GET, path: ''}
export const GetPublicFoodsIncremental: IRoute<void, ISendableFood[], {from: number, count: number}> = {method: ERouteMethod.GET, path: ''}

//Stuff
export const GetOwnFoods: IRoute<void, ISendableFood[], void> = {method: ERouteMethod.GET, path: 'own'}
export const GetSubscriptionFoods: IRoute<void, ISendableFood[], void> = {method: ERouteMethod.GET, path: 'subscription'}
export const GetFamilyFoods: IRoute<void, ISendableFood[], void> = {method: ERouteMethod.GET, path: 'family'}
export const GetCollectionFoods: IRoute<void, ISendableFood[], void> = {method: ERouteMethod.GET, path: 'collection'}

//Get, set, delete
export const GetFoodById: IRoute<void, ISendableFood, { id: string}> = {method: ERouteMethod.GET, path: ''}
export const AddOrUpdateFood: IRoute<IUpdateFoodRequest, ISendableFood, void> = {method: ERouteMethod.POST, path: ''}
export const DeleteFood: IRoute<void, ISendableFood, {foodId: string}> = {method: ERouteMethod.DELETE, path: ''}

//Image
export const UploadImage: IRoute<void, void, {foodVersionId: string}> = {method: ERouteMethod.POST, path: ''}
export const DeleteImage: IRoute<void, void, {foodVersionId: string}> = {method: ERouteMethod.DELETE, path: ''}


export const FoodController: ControllerData = {basepath: "food", name: "FoodController", routes: [GetPublicFoods, GetPublicFoodsIncremental, GetOwnFoods, GetSubscriptionFoods, GetFamilyFoods, GetCollectionFoods, GetFoodById, AddOrUpdateFood, DeleteFood, UploadImage, DeleteImage]}

