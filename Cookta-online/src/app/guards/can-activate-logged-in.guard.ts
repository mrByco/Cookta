import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {IdentityService} from '../shared/services/identity.service';
import {LoginModalComponent} from "../identity/login-modal/login-modal.component";
import {MDBModalService} from "angular-bootstrap-md";

@Injectable({
  providedIn: 'root'
})
export class CanActivateLoggedInGuard implements CanActivate {
  constructor(identityService: IdentityService, private modalService: MDBModalService) {
  }

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

      this.modalService.show(LoginModalComponent)
      resolve();
    });
  }

  getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
        .map(v => v.url.map(segment => segment.toString()).join('/'))
        .join('/');
  }


}
