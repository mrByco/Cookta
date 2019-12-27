import {EventEmitter, Injectable} from "@angular/core";
import {ServerService} from "./server.service";
import {AuthService} from "./auth.service";
import {augmentIndexHtml} from "@angular-devkit/build-angular/src/angular-cli-files/utilities/index-file/augment-index-html";

@Injectable()
export class IdentityService {
  constructor(private serverService: ServerService,
              private authService: AuthService) {
    authService.OnUserChanged.subscribe(user => this.OnUserChanged.emit(user));
  }

  public get LoggedIn(): boolean {
    return this.authService.loggedIn;
  }
  public async Login(){
    this.authService.login();
  }
  public async Logout(){
    this.authService.logout();
  }

  public OnLoginRequired = new EventEmitter();

  public OnUserChanged: EventEmitter<any> = new EventEmitter<any>();

  public PleaseLogin() {
    this.OnLoginRequired.emit();
  }


  public PleaseAccessToken(): Promise<string> {
    return new Promise(async(resolve) => {
      if (!this.LoggedIn){
        await this.Login();
      }
      let user = await this.authService.getUser$().toPromise();
      console.log(user);
      return "";
    })
  }


}
