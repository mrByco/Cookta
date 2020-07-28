import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    loggedIn: boolean;
    readonly OnUserLoginChanged: EventEmitter<void> = new EventEmitter<void>();
    public get CurrentAuthMethod(){
        return 'google-oauth2';
    }

    public get IsAuthenticated(): boolean | Promise<boolean>{
        return this.GoogleUser?.isSignedIn() ?? (this.GoogleAuth as Promise<any>).then((a) => {
            a.isSignedIn.get();
        })
    };
    public async getTokenSilently(): Promise<string>{
        if (!this.GoogleUser || !await this.IsAuthenticated){
            return;
        }
        let response = this.GoogleAuth.currentUser.get().getAuthResponse(true)
        return response.id_token;
    }

    constructor() {
        this.GoogleAuth = new Promise<any>((r) => {
            this.resolveGoogleAuth = r;
        })

    }

    private Gapi: any;
    private GoogleAuth: any | Promise<any>
    private GoogleUser: any;
    private resolveGoogleAuth: (gapi: any) => void;

    InitGapiAuth(gapi: any){
        gapi.auth2.init({client_id: '186738034909-in3efiaqeebaej9njsep88f3ejqu78r9.apps.googleusercontent.com'})
        let instance = gapi.auth2.getAuthInstance();
        this.resolveGoogleAuth(instance);
        this.GoogleAuth = instance;
        this.GoogleAuth.isSignedIn.listen(() => {this.UserLoginChanged();});
        if (this.GoogleAuth.currentUser.get()){
            this.PostLogin();
        }
        this.Gapi = gapi;
    }

    UserLoginChanged() {
        this.PostLogin();
        this.OnUserLoginChanged.emit();
    }

    async logout() {
        this.GoogleAuth.signOut();
        location.reload();
    }
    async Login() {
        let auth = await this.GoogleAuth;
        await auth.signIn();
        this.PostLogin();
    }
    PostLogin(){
        this.GoogleUser = this.GoogleUser || this.GoogleAuth.currentUser.get();
        this.loggedIn = this.GoogleUser?.isSignedIn()?? false;
        this.OnUserLoginChanged.emit();
    }
}
