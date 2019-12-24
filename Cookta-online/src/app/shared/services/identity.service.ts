import {Injectable} from "@angular/core";
import {ServerService} from "./server.service";
import {AuthService} from "./auth.service";

@Injectable()
export class IdentityService {
  constructor(private serverService: ServerService,
              private authService: AuthService) {
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
