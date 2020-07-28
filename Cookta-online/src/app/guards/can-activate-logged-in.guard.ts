import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {IdentityService} from '../shared/services/identity.service';
import {AuthService} from "../shared/services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class CanActivateLoggedInGuard implements CanActivate {


  constructor(public identityService: IdentityService, private authService: AuthService, private router: Router) {
    window['OnGapiInit'] =  (gapi) => {this.authService.InitGapiAuth(gapi)};
  }

  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(async resolve => {
      let loggedIn = await this.identityService.IsAuthenticated;
      if (loggedIn) {
        resolve(true);
        return;
      }
      this.router.navigate(['login', ...next.url.map(s => s.toString())]);
    });
  }

  getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
        .map(v => v.url.map(segment => segment.toString()).join('/'))
        .join('/');
  }


}
