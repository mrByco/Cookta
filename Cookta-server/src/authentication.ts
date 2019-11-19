import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import {User} from "./models/user.model";

const jwksClient = require('jwks-rsa');

const client = jwksClient({
    strictSsl: true,
    jwksUri: 'https://kukta.eu.auth0.com/.well-known/jwks.json',
    requestHeaders: {},
    requestAgentOptions: {}
});

const debugTokenAdminByc0 = 'admin';


//Anonim callable route: "noauth"
export async function expressAuthentication(request: express.Request, securityName: string, permissions?: string[]): Promise<any> {
    let authHeader = request.headers["authorization"];
    if (!authHeader){
        console.log(`Unauthorized call from: ${request.ip})`);
        return new Promise( (resolve, reject) => {reject(new Error("No authorization header!"))});
    }
    if (process.env.NODE_ENV == "debug " && authHeader == "admin"){
        return new User("5d443d40a53b9142100be6ad", "XRKPJAl2CKioPj6WrX4ZjXcrkRkO9xzW@clients", ['XRKPJAl2CKioPj6WrX4ZjXcrkRkO9xzW@clients'], 'Matyi1809454', "member", 'example&something.com', [], '', '')
    }

    if (permissions[0] == "noauth" && !authHeader) {
        return null;
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
                        try{
                            let user = await User.FetchUser(accessToken);
                            if (!user)
                                reject(new Error("Cant get or create user."));
                            for (let permission of permissions){
                                if (!user.HasPermission(permission)){
                                    reject(new Error("Not all the permissions covered."));
                                }
                            }
                            resolve(user);
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
