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
        console.log('Getting token');
        if (!this.GoogleUser || !await this.IsAuthenticated){
            return;
        }
        let response = this.GoogleAuth.currentUser.get().getAuthResponse(true)
        console.log(response);
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
        console.log('User signed in ' + this.GoogleUser.isSignedIn());
        this.Gapi = gapi;
    }

    UserLoginChanged() {
        this.PostLogin();
        this.OnUserLoginChanged.emit();
    }

/*    public OnUserChanged: EventEmitter<any> = new EventEmitter<any>();

    public LoadIdentity(): void{
        this.IsAuthenticated = new Promise(async resolve => {
            // On initial load, check authentication state with authorization server
            // Set up local auth streams if user is already authenticated
            let loggedIn = await this.localAuthSetup()
            if (loggedIn)
                resolve(true);

            // Handle redirect from Auth0 login
            loggedIn = await this.handleAuthCallback();
            resolve(loggedIn);
        })

        this.getUser$().subscribe(user => this.OnUserChanged.emit(user));
    }

    // When calling, options can be passed if desired
    // https://auth0.github.io/auth0-spa-js/classes/auth0client.html#getuser
    getUser$(options?): Observable<any> {
        return this.auth0Client$.pipe(
            concatMap((client: Auth0Client) => from(client.getUser(options))),
            tap(user => this.userProfileSubject$.next(user))
        );
    }

    getTokenSilently$(): Observable<string> {
        return this.auth0Client$.pipe(
            concatMap((client: Auth0Client) => from(client.getTokenSilently()))
        );
    }

*/

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
        console.log('Successful sign in');
        this.GoogleUser = this.GoogleUser || this.GoogleAuth.currentUser.get();
        this.loggedIn = this.GoogleUser?.isSignedIn()?? false;
        this.OnUserLoginChanged.emit();
    }
}
