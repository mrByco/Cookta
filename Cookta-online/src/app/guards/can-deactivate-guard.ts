import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import { Injectable } from "@angular/core";
export interface ICanDeactivate {
  CanDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
@Injectable()
export class CanDeactivateGuard implements CanDeactivate<ICanDeactivate> {
  canDeactivate(component: ICanDeactivate,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot,
                nextState?: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return component.CanDeactivate();
  }

}
