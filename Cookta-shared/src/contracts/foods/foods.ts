import {IRoute} from 'waxen/dist/abstract/route.interface';
import {ISendableFood} from '../../models/food/food-sendable.interface';
import {ERouteMethod} from 'waxen/dist/route-method.enum';
import {IUpdateFoodRequest} from './update-food.request';
import {ControllerData} from 'waxen/dist/abstract/controller.interface';


//Unsecured
const GetPublicFoods: IRoute<void, ISendableFood[], void> = {method: ERouteMethod.GET, path: ''};
const GetPublicFoodsIncremental: IRoute<void, ISendableFood[], { from: number, count: number }> = {method: ERouteMethod.GET, path: ''};

//Stuff
const GetOwnFoods: IRoute<void, ISendableFood[], void> = {method: ERouteMethod.GET, path: 'own'};
const GetSubscriptionFoods: IRoute<void, ISendableFood[], void> = {method: ERouteMethod.GET, path: 'subscription'};
const GetFamilyFoods: IRoute<void, ISendableFood[], void> = {method: ERouteMethod.GET, path: 'family'};
const GetCollectionFoods: IRoute<void, ISendableFood[], void> = {method: ERouteMethod.GET, path: 'collection'}
const SearchFoods: IRoute<void, {results: ISendableFood[]}, {text: string, count: number}> = {method: ERouteMethod.GET, path: 'search'}

//Get, set, delete
const GetFoodById: IRoute<void, ISendableFood, { id: string }> = {method: ERouteMethod.GET, path: ''};
const GetFoodPageById: IRoute<void, { food: ISendableFood, recommendations: ISendableFood[] }, { id: string }> = {
    method: ERouteMethod.GET,
    path: 'page'
};
const AddOrUpdateFood: IRoute<IUpdateFoodRequest, ISendableFood, void> = {method: ERouteMethod.POST, path: ''};
const DeleteFood: IRoute<void, ISendableFood, {foodId: string}> = {method: ERouteMethod.DELETE, path: ''}

//Image
const UploadImage: IRoute<void, void, {foodVersionId: string}> = {method: ERouteMethod.POST, path: 'image'}
const DeleteImage: IRoute<void, void, {foodVersionId: string}> = {method: ERouteMethod.DELETE, path: 'image'}


export const FoodControllerData: ControllerData = {
    basepath: 'food',
    name: 'FoodController',
    routes: [GetPublicFoods, GetPublicFoodsIncremental, GetOwnFoods, GetSubscriptionFoods, GetFamilyFoods, GetCollectionFoods, GetFoodById, GetFoodPageById, AddOrUpdateFood, DeleteFood, UploadImage, DeleteImage, SearchFoods]
};

