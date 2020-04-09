import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {CookieService} from 'ngx-cookie-service';

@Injectable()
export class ServerService {
  constructor(private http: HttpClient, private authService: AuthService, private cookieService: CookieService) {
    this.m_UseDebugServer = cookieService.get('use-debug-server') == 'true';
    if (this.m_UseDebugServer) {
      this.CheckServerAvailable();
    }
  }

  public async CheckServerAvailable() {
    return new Promise(async (resolve) => {
      let response = await this.http.get(this.GetBase() + '/ping');
      response.subscribe(() => {
        console.log('Server ping success!');
        resolve();
      }, async ()  => {
        console.log('Server ping failed!');
        let confirmed = await confirm('Debug server not available on \'http://localhost:8080/ping\'. Switching to production server...');
        this.UseDebugServer = false;
        location = location;
        resolve();
      });
    });
  }

  public get UseDebugServer() {
    return this.m_UseDebugServer;
  }

  public set UseDebugServer(value: boolean) {
    this.cookieService.set('use-debug-server', value + '', 6000);
    this.m_UseDebugServer = value;
  }

  private m_UseDebugServer: boolean;

  public GetBase(): string {
    return this.UseDebugServer
      ? 'http://localhost:8080' : 'https://cooktaservices.azurewebsites.net';
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
      return this.http.get(this.GetBase() + route, options);
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
      options);
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
      return this.http.delete(this.GetBase() + route, options);
    }
  }
}
