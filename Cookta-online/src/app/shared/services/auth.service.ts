import {EventEmitter, Injectable} from '@angular/core';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import {BehaviorSubject, combineLatest, from, Observable, of, throwError} from 'rxjs';
import {catchError, concatMap, shareReplay, tap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public OnUserChanged: EventEmitter<any> = new EventEmitter<any>();

    // Create an observable of Auth0 instance of client
    auth0Client$ = (from(
        createAuth0Client({
            domain: "kukta.eu.auth0.com",
            client_id: "fEVmPj3vysPdmdQbJOGx020xIVoZusjV",
            redirect_uri: `${window.location.origin}`,
            audience: "https://cooktaservices.azurewebsites.net"
        })
    ) as Observable<Auth0Client>).pipe(
        shareReplay(1), // Every subscription receives the same shared value
        catchError(err => throwError(err))
    );
    // Define observables for SDK methods that return promises by default
    // For each Auth0 SDK method, first ensure the client instance is ready
    // concatMap: Using the client instance, call SDK method; SDK returns a promise
    // from: Convert that resulting promise into an observable
    public IsAuthenticated: boolean | Promise<boolean> = false;
    isAuthenticated$ = this.auth0Client$.pipe(
        concatMap((client: Auth0Client) => from(client.isAuthenticated())),
        tap(res => this.loggedIn = res)
    );
    handleRedirectCallback$ = this.auth0Client$.pipe(
        concatMap((client: Auth0Client) => from(client.handleRedirectCallback()))
    );
    // Create subject and public observable of user profile data
    private userProfileSubject$ = new BehaviorSubject<any>(null);
    userProfile$ = this.userProfileSubject$.asObservable();
    // Create a local property for login status
    loggedIn: boolean = null;

    constructor(private router: Router) {
    }
    
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

    private localAuthSetup(): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            // This should only be called on app initialization
            // Set up local authentication streams
            const checkAuth$ = this.isAuthenticated$.pipe(
                concatMap((loggedIn: boolean) => {
                    if (loggedIn) {
                        // If authenticated, get user and set in app
                        // NOTE: you could pass options here if needed
                        resolve(true);
                        return this.getUser$();
                    }
                    // If not authenticated, return stream that emits 'false'
                    resolve(false);
                    return of(loggedIn);
                })
            );
            checkAuth$.subscribe();
        });
    }

    public login(redirectPath: string = '/') {
        // A desired redirect path can be passed to login method
        // (e.g., from a route guard)
        // Ensure Auth0 client instance exists
        this.auth0Client$.subscribe((client: Auth0Client) => {
            // Call method to log in
            client.loginWithRedirect({
                redirect_uri: `${window.location.origin}`,
                appState: {target: redirectPath}
            });
        });
    }

    private handleAuthCallback(): Promise<boolean> {
        // Call when app reloads after user logs in with Auth0
        console.log('Handling auth callback');
        const params = window.location.search;
        if (params.includes('code=') && params.includes('state=')) {
            return new Promise<boolean>(resolve => {
                let targetRoute: string; // Path to redirect to after login processsed
                const authComplete$ = this.handleRedirectCallback$.pipe(
                    // Have client, now call method to handle auth callback redirect
                    tap(cbRes => {
                        // Get and set target redirect route from callback results

                        targetRoute = cbRes.appState && cbRes.appState.target ? cbRes.appState.target : '/';
                    }),
                    concatMap(() => {
                        // Redirect callback complete; get user and login status
                        return combineLatest([
                            this.getUser$(),
                            this.isAuthenticated$
                        ]);
                    })
                );
                // Subscribe to authentication completion observable
                // Response will be an array of user and login status
                authComplete$.subscribe(([user, loggedIn]) => {
                    // Redirect to target route after callback processing
                    this.OnUserChanged.emit(user);
                    this.router.navigate([targetRoute]);
                    resolve(true);
                });
            });
        } else
            return new Promise(r => r(false));
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

}
