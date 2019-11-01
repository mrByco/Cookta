import * as express from 'express';
import * as jwt from 'jsonwebtoken';

const jwksClient = require('jwks-rsa');

const client = jwksClient({
    strictSsl: true,
    jwksUri: 'https://kukta.eu.auth0.com/.well-known/jwks.json',
    requestHeaders: {},
    requestAgentOptions: {}
});


export async function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {
    let accessToken = request.headers["authorization"].toString();
    console.log("Bearer auth");
    if (accessToken.startsWith("Bearer "))
    {
        accessToken = accessToken.replace("Bearer ", "");
        const signature = accessToken.split('.')[2];
        const decoded = jwt.decode(accessToken, {complete: true});
        const decodedHeader = decoded.header;
        const kid = decodedHeader['kid'];

        return new Promise((resolve, reject) => {
            client.getSigningKey(kid, (err, key) => {
                let verifyOptions = {
                    algorithms: ["RS256"]
                }

                if (err){
                    return reject(new Error("Cant get public key"));
                }else{
                    let publicKey = key.publicKey;
                    try{
                        jwt.verify(accessToken, publicKey, verifyOptions);
                        //TODO identify the user
                        //TODO Check custom permissions
                        //TODO Return the user object
                        for (let scope of scopes){
                            if (!decoded.payload.permissions.includes(scope)){
                                reject(new Error("Not all the permissions covered."));
                            }
                        }
                        return resolve(decoded.payload);
                    }catch{
                        return reject(new Error("Invalid signature"));
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
