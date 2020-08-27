import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {CookieService} from 'ngx-cookie-service';
import {Observable} from 'rxjs';
import {HttpResponse, IHttpCaller} from 'waxen/dist/client/IHttpCaller';

@Injectable()
export class ServerService {

  constructor(private http: HttpClient, private authService: AuthService, private cookieService: CookieService) {
    this.m_UseDebugServer = cookieService?.get('use-debug-server') == 'true';
  }

  public async CheckServerAvailable(): Promise<void> {

    console.log(this.GetBase());
    return new Promise(async (resolve) => {
      let response = await this.http.get(this.GetBase() + '/ping');
      response.subscribe(() => {
        console.log('Server ping success!');
        resolve();
      }, async () => {
        console.log('Server ping failed!');
        let confirmed = await confirm('Debug server not available on ' + this.GetBase() + '. Switching to production server...');
        if (confirmed) {
          this.UseDebugServer = false;
          location.reload();
        } else {
          location.reload();
        }
        resolve();
      });
    });
  }

  public get UseDebugServer() {
    return this.m_UseDebugServer;
  }

  public set UseDebugServer(value: boolean) {
    this.cookieService.set('use-debug-server', value + '', 6000, '/');
    this.m_UseDebugServer = value;
  }

  private m_UseDebugServer: boolean;

  public GetBase(): string {
    return this.UseDebugServer
      ? 'http://localhost:8080' : 'https://cooktaservices.azurewebsites.net';
  }

  public async GetRequest(route: string, securedOnly?: boolean): Promise<Observable<any>> {
    let loggedIn: boolean = await this.authService.IsAuthenticated;
    if (!loggedIn) {
      return securedOnly ? new Observable(() => {
        throw Error('Logged in only')
      }) : this.http.get(this.GetBase() + route);
    } else {
      let token = await this.authService.getTokenSilently();
      let options = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'auth-method': this.authService.CurrentAuthMethod,
        })
      };
      return this.http.get(this.GetBase() + route, options);
    }
  }

  public async PostRequest(route: string, body: any, file?: boolean): Promise<Observable<any>> {
    let loggedIn: boolean = await this.authService.IsAuthenticated;
    let options = {headers: new HttpHeaders()};
    if (loggedIn) {
      let token = await this.authService.getTokenSilently();
      options.headers = options.headers.append('Authorization', `Bearer ${token}`);
      options.headers = options.headers.append('auth-method', this.authService.CurrentAuthMethod);
    }
    let data = body;
    if (file) {
      data = new FormData();
      data.append('image', body as File);
    }
    return this.http.post(
      this.GetBase() + route, data,
      options);
  }

  public async PutRequest(route: string, body: any, file?: boolean): Promise<Observable<any>> {
    let loggedIn: boolean = await this.authService.IsAuthenticated;
    let options = {headers: new HttpHeaders()};
    if (loggedIn) {
      let token = await this.authService.getTokenSilently();
      options.headers = options.headers.append('Authorization', `Bearer ${token}`);
      options.headers = options.headers.append('auth-method', this.authService.CurrentAuthMethod);
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

  public async DeleteRequest(route: string): Promise<Observable<any>> {
    let loggedIn: boolean = await this.authService.IsAuthenticated;
    if (!loggedIn) {
      return this.http.delete(this.GetBase() + route);
    } else {
      let token = await this.authService.getTokenSilently();
      let options = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'auth-method': this.authService.CurrentAuthMethod,
        })
      };
      return this.http.delete(this.GetBase() + route, options);
    }
  }

  public GetHttpCaller(): IHttpCaller {
    return {
      GET: (url: string) => this.GetRequest(url, false),
      DELETE: (url: string) => this.DeleteRequest(url),
      POST: (url: string, body?: any, file?: any) => this.PostRequest(url, body, file),
      PUT: (url: string, body?: any) => this.PutRequest(url, body),
    }
  }
}
