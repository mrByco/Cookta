import * as jwt from 'jsonwebtoken';
import {Services} from "../Services";
import * as doRequest from "request";
import {User} from "../models/user.model";

const jwksClient = require('jwks-rsa');

const client = jwksClient({
    strictSsl: true,
    jwksUri: 'https://kukta.eu.auth0.com/.well-known/jwks.json',
    requestHeaders: {},
    requestAgentOptions: {}
});

const debugTokenAdminByc0 = 'admin';


export async function defaultAuthentication(request: any, anonymousEnabled: boolean, permissions: string[]): Promise<any> {
    let authHeader = request.headers["authorization"];
    let authMethod = request.headers["auth-method"];


    if (process.env.NODE_ENV == "debug " && authHeader == "admin"){
        return Services.UserService.FindOne(u => u.sub == "XRKPJAl2CKioPj6WrX4ZjXcrkRkO9xzW@clients");
    }

    if (anonymousEnabled && !authHeader) {
        return null;
    }

    if (!authHeader){
        console.log(`Unauthorized call from: ${request.ip})`);
        return new Promise( (resolve, reject) => {reject(new Error("No authorization header!"))});
    }

    let accessToken = authHeader.toString();
    accessToken = accessToken.replace("Bearer ", "");
    let user: User;

    if (authMethod == 'google-oauth2' && !user){
        const googleEndPoint = 'https://oauth2.googleapis.com/tokeninfo';
        let verifiedUserInfo = await new Promise((resolve, reject) => {
            const options = {
                method: 'GET',
                uri: `${googleEndPoint}?id_token=${accessToken}`,
                json: true,
            };
            doRequest(options, (err, res, body) => {
                if (err) {
                    console.error(`Error when get user info from auth0: ${err.toString()}`);
                    reject(null);
                    return;
                }
                resolve(body);
            });
        });
        if (!verifiedUserInfo) throw new Error('Cant authenticate user');
        verifiedUserInfo['sub'] = `${authMethod}|${verifiedUserInfo['sub']}`;
        user = await Services.UserService.GetUserForAuth(verifiedUserInfo['sub'], verifiedUserInfo);
    }

    if (!user) {
        //Legacy auth0 authorization
        console.log("Auth0 authentication");
        const signature = accessToken.split('.')[2];
        const decoded = jwt.decode(accessToken, {complete: true});
        const decodedHeader = decoded.header;
        const kid = decodedHeader['kid'];

        user = await new Promise((resolve, reject) => {
            client.getSigningKey(kid, async (err, key) => {
                let verifyOptions = {
                    algorithms: ["RS256"]
                };

                if (err) {
                    return reject(new Error("Cant get public key"));
                } else {
                    let publicKey = key.publicKey;
                    try {
                        jwt.verify(accessToken, publicKey, verifyOptions);
                    } catch {
                        return reject(new Error("Invalid signature"));
                    } finally {
                        let user = await Services.UserService.GetUserForAuth0(decoded.payload.sub, accessToken);
                        if (!user)
                            reject(new Error("Cant get or create user."));
                        resolve(user);
                        try {
                        } catch {
                            reject(new Error('Cant check permissions!'))
                        }
                    }
                }
                const signingKey = key.publicKey || key.rsaPublicKey;
                resolve(null);
            });
        })
    }

    for (let permission of permissions){
        if (!user || !user.HasPermission(permission)){
            if (anonymousEnabled)
                return null;
            throw new Error("Not all the permissions covered.");
        }
    }
    return user;
}
