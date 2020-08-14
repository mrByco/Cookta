import {configureTnsOAuth} from 'nativescript-oauth2';
import {
    TnsOaProvider,
    TnsOaProviderFacebook,
    TnsOaProviderGoogle,
    TnsOaProviderIdentityServer,
    TnsOaProviderMicrosoft,
    TnsOaProviderOptionsFacebook,
    TnsOaProviderOptionsGoogle,
    TnsOaProviderOptionsIdentityServer,
    TnsOaProviderOptionsMicrosoft
} from 'nativescript-oauth2/providers';

export function configureOAuthProviders() {
    // const microsoftProvider = configureOAuthProviderMicrosoft();
    const googleProvider = configureOAuthProviderGoogle();
    /*const facebookProvider = configureOAuthProviderFacebook();
    const identityServer = configureOAuthProviderIdentityServer();
*/
    configureTnsOAuth([googleProvider]);
}

export function configureOAuthProviderGoogle(): TnsOaProvider {
    const googleProviderOptions: TnsOaProviderOptionsGoogle = {
        openIdSupport: 'oid-full',
        clientId:
            '186738034909-klmtjetbd8ldmda5sju8rgnur6bvbq7r.apps.googleusercontent.com',
        redirectUri:
            'com.googleusercontent.apps.186738034909-klmtjetbd8ldmda5sju8rgnur6bvbq7r:/auth',
        urlScheme:
            'com.googleusercontent.apps.186738034909-klmtjetbd8ldmda5sju8rgnur6bvbq7r',
        scopes: ['email']
    };
    const googleProvider = new TnsOaProviderGoogle(googleProviderOptions);
    return googleProvider;
}

export function configureOAuthProviderFacebook(): TnsOaProvider {
    const facebookProviderOptions: TnsOaProviderOptionsFacebook = {
        openIdSupport: 'oid-none',
        clientId: '691208554415645',
        clientSecret: 'd8725ac416fa1bb1917ccffd1670e3c6',
        redirectUri: 'https://www.facebook.com/connect/login_success.html',
        scopes: ['email']
    };
    const facebookProvider = new TnsOaProviderFacebook(facebookProviderOptions);
    return facebookProvider;
}

export function configureOAuthProviderMicrosoft(): TnsOaProvider {
    const microsoftProviderOptions: TnsOaProviderOptionsMicrosoft = {
        openIdSupport: 'oid-full',
        clientId: 'f376fa87-64a9-49a1-8b56-e0d48fc0810b',
        // redirectUri: "urn:ietf:wg:oauth:2.0:oob",
        redirectUri: 'msalf376fa87-64a9-49a1-8b56-e0d48fc0810b://auth',
        urlScheme: 'msalf376fa87-64a9-49a1-8b56-e0d48fc0810b',
        scopes: ['openid', 'https://outlook.office.com/mail.read']
    };
    const microsoftProvider = new TnsOaProviderMicrosoft(
        microsoftProviderOptions
    );
    return microsoftProvider;
}

export function configureOAuthProviderIdentityServer(): TnsOaProvider {
    const identityServerProviderOptions: TnsOaProviderOptionsIdentityServer = {
        openIdSupport: 'oid-full',
        issuerUrl: 'https://demo.identityserver.io',
        clientId: 'native.code',
        urlScheme: 'org.nativescript.demoangular',
        redirectUri: 'org.nativescript.demoangular://auth',
        scopes: ['openid', 'profile', 'email', 'offline_access'],
    };
    const identityServerProvider = new TnsOaProviderIdentityServer(
        identityServerProviderOptions
    );
    return identityServerProvider;
}
