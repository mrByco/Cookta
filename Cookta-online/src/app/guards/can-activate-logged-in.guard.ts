import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {IdentityService} from '../shared/services/identity.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateLoggedInGuard implements CanActivate {
  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(async resolve => {
      let loggedIn = await IdentityService.Instance.IsAuthenticated;
      if (loggedIn) {
        resolve(true);
        return;
      }
      let url = this.getResolvedUrl(next);
      resolve(await IdentityService.Instance.PleaseLogin(url));
    });
  }

  getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
        .map(v => v.url.map(segment => segment.toString()).join('/'))
        .join('/');
  }


}
