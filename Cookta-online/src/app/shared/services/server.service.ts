import {Routes} from "../routes";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";

@Injectable()
export class ServerService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  public GetBase(): string {
    return "https://cooktaservices.azurewebsites.net";
  }
  public async GetRequest(route: string): Promise<any> {
    let loggedIn: boolean = await this.authService.isAuthenticated$.toPromise();
    if (!loggedIn){
      return this.http.get(this.GetBase() + route);
    }else{
      let token = await this.authService.getTokenSilently$().toPromise();
      let options = {
        headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`})
      };
      return this.http.get(this.GetBase() + route, options)
    }
  }
  public async PostRequest(route: string, body: any): Promise<any> {
    let loggedIn: boolean = await this.authService.isAuthenticated$.toPromise();
    if (!loggedIn){
      return this.http.post(this.GetBase() + route, body);
    }else{
      let token = await this.authService.getTokenSilently$().toPromise();
      let options = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`})
      };
      return this.http.post(this.GetBase() + route, body, options)
    }
  }
}
