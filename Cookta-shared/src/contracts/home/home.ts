import {ControllerData} from 'waxen/dist/abstract/controller.interface';
import {IRoute} from 'waxen/dist/abstract/route.interface';
import {ERouteMethod} from 'waxen/dist/route-method.enum';
import {IHomeContentRequest} from './home-content.request';
import {IHomeRowContent} from '../../models/home/home-row-content.interface';
import {IHomeContent} from '../../models/home/home-content.interface';


const GetHome: IRoute<void, IHomeContent, void> = {method: ERouteMethod.GET, path: ''};
const GetHomeContent: IRoute<IHomeContentRequest[], IHomeRowContent[], void> = {method: ERouteMethod.PUT, path: ''};

export const HomeControllerData: ControllerData = {
    basepath: 'home', name: 'Home', routes: [GetHome, GetHomeContent]
};
