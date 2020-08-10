import {EventEmitter, Injectable} from '@angular/core';

import {ITnsOAuthTokenResult, TnsOAuthClient} from 'nativescript-oauth2';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private static Instance: AuthService;
    public LoggedIn: boolean = false;
    public AuthToken: { accessToken: undefined, refreshToken: undefined, idToken: undefined };
    public OnLoginStateRefreshed = new EventEmitter<void>();
    private client: TnsOAuthClient = null;

    constructor() {
        console.log(`${Math.round(Math.random() * 60)} - AUTH SERVICE INJECTED`);
        if (!AuthService.Instance) {
            AuthService.Instance = this;
        }
    }

    static GetInstance() {
        if (!this.Instance) {
            return this.Instance = new AuthService();
        }
        return this.Instance;
    }

    public tnsOauthLogin(providerType): Promise<ITnsOAuthTokenResult> {
        this.client = new TnsOAuthClient(providerType);

        return new Promise<ITnsOAuthTokenResult>((resolve, reject) => {
            this.client.loginWithCompletion(
                (tokenResult: ITnsOAuthTokenResult, error) => {
                    if (error) {
                        console.error('back to main page with error: ');
                        console.error(error);
                        this.LoggedIn = false;
                        this.OnLoginStateRefreshed.emit();
                        reject(error);
                    } else {
                        console.log('back to main page with an access token...');
                        this.LoggedIn = true;
                        this.OnLoginStateRefreshed.emit();
                        console.log('back to main page with an access token...');
                        resolve(tokenResult);
                    }
                }
            );
        });
    }

    public tnsOauthLogout(): Promise<any> {

        this.AuthToken = undefined;
        this.LoggedIn = false;
        this.OnLoginStateRefreshed.emit();
        return new Promise<any>((resolve, reject) => {
            if (this.client) {
                this.client.logoutWithCompletion(
                    (error) => {
                        if (error) {
                            console.error('back to main page with error: ');
                            console.error(error);
                            reject(error);
                        } else {
                            console.log('back to main page with success');
                            resolve();
                        }
                    }
                );
            } else {
                console.log('back to main page with success');
                resolve();
            }
        });
    }
}
