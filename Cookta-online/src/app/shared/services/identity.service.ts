import {EventEmitter, Injectable} from '@angular/core';
import {ServerService} from './server.service';
import {AuthService} from './auth.service';
import {augmentIndexHtml} from '@angular-devkit/build-angular/src/angular-cli-files/utilities/index-file/augment-index-html';
import {Routes} from '../routes';
import {User} from '../models/identity/User';
import {Food} from '../models/grocery/food.model';
import {Family} from '../models/family.model';
import {FamilyService} from './family.service';

@Injectable()
export class IdentityService {
  constructor(private serverService: ServerService,
              private authService: AuthService) {
    authService.OnUserChanged.subscribe(user => this.OnUserChanged.emit(user));
    authService.OnUserChanged.subscribe(user => this.LastKnownUserInfo = user);
    authService.OnUserChanged.subscribe(user => this.RefreshUser());
  }

  public get LoggedIn(): boolean {
    return this.authService.loggedIn;
  }

  public async Login() {
    this.authService.login();
  }

  public async Logout() {
    this.authService.logout();
  }

  public OnLoginRequired = new EventEmitter();

  public LastKnownUserInfo: any = {};

  public Identity: User;

  public OnUserChanged: EventEmitter<any> = new EventEmitter<any>();
  public OnIdentityChanged: EventEmitter<User> = new EventEmitter<User>();
  public PleaseLogin() {
    this.OnLoginRequired.emit();
  }

  public async HasPermission(permission: string): Promise<boolean> {
    let response = await this.serverService.GetRequest(Routes.User.HasPermission.replace('{permission}', permission));
    return new Promise<boolean>(async (resolve) => {
      response.subscribe(data => {
        resolve(JSON.parse(data));
      }, error => {
        resolve(false);
      });
    });
  }

  public async RefreshUser(): Promise<void> {
    return new Promise(async (resolve) => {
      let response = await this.serverService.GetRequest(Routes.User.GetUser);
      let foods: Food[] = [];
      response.subscribe(data => {
        this.Identity = data as User;
        console.log(this.Identity);
        this.OnIdentityChanged.emit(this.Identity);
        resolve();
      }, () => {
        resolve();
      });
    });
  }


  public PleaseAccessToken(): Promise<string> {
    return new Promise(async (resolve) => {
      if (!this.LoggedIn) {
        await this.Login();
      }
      let user = await this.authService.getUser$().toPromise();
      return '';
    });
  }


}
