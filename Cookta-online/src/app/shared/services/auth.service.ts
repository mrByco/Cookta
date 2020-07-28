import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    loggedIn: boolean;
    readonly OnUserLoginChanged: EventEmitter<void> = new EventEmitter<void>();

    public get IsAuthenticated(): boolean | Promise<boolean>{
        return this.GoogleAuth?.isSignedIn?.get() ?? (this.GoogleAuth as Promise<any>).then((a) => {
            a.isSignedIn.get();
        })
    };
    public async getTokenSilently(): Promise<string>{
        console.log('Getting token');
        if (!this.GoogleAuth || !await this.IsAuthenticated){
            return;
        }
        let response = this.GoogleAuth.currentUser.get().getAuthResponse(true)
        console.log(response);
        return response.access_token;
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
        console.log('User signed in ' + this.GoogleAuth.isSignedIn.get());
        this.Gapi = gapi;
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

    logout() {
        // Ensure Auth0 client instance exists
        this.auth0Client$.subscribe((client: Auth0Client) => {
            // Call method to log out
            client.logout({
                client_id: "fEVmPj3vysPdmdQbJOGx020xIVoZusjV",
                returnTo: `${window.location.origin}`
            });
        });
    }
*/
    async Login() {
        let auth = await this.GoogleAuth;
        await auth.signIn();
        console.log('Successful sign in');
        this.loggedIn = auth.isSignedIn.get();
        this.OnUserLoginChanged.emit();
    }
}
