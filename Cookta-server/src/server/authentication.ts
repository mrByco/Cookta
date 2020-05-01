import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import {Services} from "../Services";

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
    console.log("Bearer auth");
    if (accessToken.startsWith("Bearer "))
    {
        accessToken = accessToken.replace("Bearer ", "");
        const signature = accessToken.split('.')[2];
        const decoded = jwt.decode(accessToken, {complete: true});
        const decodedHeader = decoded.header;
        const kid = decodedHeader['kid'];

        return new Promise( (resolve, reject) => {
            client.getSigningKey(kid, async (err, key) => {
                let verifyOptions = {
                    algorithms: ["RS256"]
                };

                if (err){
                    return reject(new Error("Cant get public key"));
                }else{
                    let publicKey = key.publicKey;
                    try{
                        jwt.verify(accessToken, publicKey, verifyOptions);
                    }catch{
                        return reject(new Error("Invalid signature"));
                    }
                    finally {
                        let user = await Services.UserService.GetUserForAuth(decoded.payload.sub, accessToken);
                        if (!user)
                            reject(new Error("Cant get or create user."));
                        for (let permission of permissions){
                            if (!user.HasPermission(permission)){
                                reject(new Error("Not all the permissions covered."));
                            }
                        }
                        resolve(user);
                        try{
                        }catch{
                            reject(new Error('Cant check permissions!'))
                        }
                    }
                }
                const signingKey = key.publicKey || key.rsaPublicKey;
                return resolve({name: "Pass"});
            });
        })
    }else{
        return Promise.reject("No bearer");
    }


}
