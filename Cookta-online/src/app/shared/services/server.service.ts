import {Routes} from "../routes";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";

@Injectable()
export class ServerService {
  constructor(private http: HttpClient, private authService: AuthService) {
  }

  public GetBase(): string {
    return false ? "http://localhost:8080" : "https://cooktaservices.azurewebsites.net";
  }

  public async GetRequest(route: string): Promise<any> {
    let loggedIn: boolean = await this.authService.isAuthenticated$.toPromise();
    if (!loggedIn) {
      return this.http.get(this.GetBase() + route);
    } else {
      let token = await this.authService.getTokenSilently$().toPromise();
      let options = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      };
      return this.http.get(this.GetBase() + route, options)
    }
  }

  public async PostRequest(route: string, body: any, file?: boolean): Promise<any> {
    let loggedIn: boolean = await this.authService.isAuthenticated$.toPromise();
    let options = {headers: new HttpHeaders()};
    if (loggedIn) {
      let token = await this.authService.getTokenSilently$().toPromise();
      options.headers = options.headers.append('Authorization', `Bearer ${token}`);
    }
    let data = body;
    if (file) {
      data = new FormData();
      data.append('image', body as File);
    }
    return this.http.post(
      this.GetBase() + route, data,
      options)
  }

  public async PutRequest(route: string, body: any, file?: boolean): Promise<any> {
    let loggedIn: boolean = await this.authService.isAuthenticated$.toPromise();
    let options = {headers: new HttpHeaders()};
    if (loggedIn) {
      let token = await this.authService.getTokenSilently$().toPromise();
      options.headers = options.headers.append('Authorization', `Bearer ${token}`);
    }
    let data = body;
    if (file) {
      data = new FormData();
      data.append('image', body as File);
    }
    return this.http.put(
      this.GetBase() + route, data,
      options);
  }

  public async DeleteRequest(route: string): Promise<any> {
    let loggedIn: boolean = await this.authService.isAuthenticated$.toPromise();
    if (!loggedIn) {
      return this.http.delete(this.GetBase() + route);
    } else {
      let token = await this.authService.getTokenSilently$().toPromise();
      let options = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      };
      return this.http.delete(this.GetBase() + route, options)
    }
  }
}
