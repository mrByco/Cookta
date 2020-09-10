import {EventEmitter, Injectable} from '@angular/core';
import {ServerService} from './server.service';
import {AuthService} from './auth.service';
import {Routes} from '../routes';
import {User} from '../models/identity/User';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class IdentityService {
  public static Instance: IdentityService;
  public OnLoginRequired = new EventEmitter<{modalCallback: (loggedIn: boolean) => void, options?: {redirectOnFail?: string}}>();
  public Identity: User;
  public OnIdentityChanged: EventEmitter<User> = new EventEmitter<User>();

  constructor(private serverService: ServerService,
              private authService: AuthService) {
    authService.OnUserChanged.subscribe(() => this.RefreshUser());
    if (!IdentityService.Instance) {
      IdentityService.Instance = this;
    }
  }

  public async LoadIdentity(): Promise<any>{
    this.authService.LoadIdentity();
    await this.IsAuthenticated;
  }

  public get IsAuthenticated(): Promise<boolean> | boolean {
    return this.authService.IsAuthenticated;
  }

  public get LoggedIn(): boolean {
    return this.authService.loggedIn;
  }

  public async Login(redirect?: string) {
    await this.authService.login(redirect);
  }

  public async Logout() {
    this.authService.logout();
  }

  public PleaseLogin(redirect: string = '/', options?: {redirectOnFail?: string}): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.OnLoginRequired.emit({modalCallback: resolve, options});
    });
  }

  public async HasPermission(permission: string): Promise<boolean> {
    let response = await this.serverService.GetRequest(Routes.User.HasPermission.replace('{permission}', permission), true);
    return new Promise<boolean>(async (resolve) => {
      response.subscribe(data => {
        resolve(JSON.parse(data));
      }, () => {
        resolve(false);
      });
    });
  }

  public async RefreshUser(): Promise<void> {
    return new Promise(async (resolve) => {
      let response = await this.serverService.GetRequest(Routes.User.GetUser, true);
      response.subscribe(data => {
        this.Identity = data as User;
        this.OnIdentityChanged.emit(this.Identity);
        resolve();
      }, () => {
        resolve();
      });
    });
  }

  public async ChangeUsername(name: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      let response = await this.serverService.PutRequest(Routes.User.SetUsername.replace('{name}', name), undefined);
      response.subscribe(data => {
        this.Identity = data as User;
        this.OnIdentityChanged.emit(this.Identity);
        resolve();
        location.reload();
      }, (error: HttpErrorResponse) => {
        console.log('error: ' + error.message);
        reject();
        location.reload();
      });
    });
  }

  public async UsernameExist(name: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      let response = await this.serverService.GetRequest(Routes.User.CheckUsername.replace('{name}', name));
      response.subscribe(data => {
        resolve(data as boolean);
      }, (error: HttpErrorResponse) => {
        reject(error);
      });
    });
  }

  public async DeleteUser(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      let response = await this.serverService.DeleteRequest(Routes.User.DeleteUser);
      response.subscribe(data => {
        resolve(data as boolean);
      }, (error: HttpErrorResponse) => {
        reject(error);
      });
    });
  }
}
