import {StoreService} from "atomik/store-service/store-service";
import {User} from "../../models/user.model";
import {ObjectId} from "bson";
import * as request from "request";


export class UserService extends StoreService<User> {

    public async GetUserForAuth(sub: string, accessToken): Promise<User> {
        let user: User;
        user = this.FindOne(u => u.sub == sub);
        if (user)
            return user;
        else
            return await this.UnknownUserSub(accessToken);
    }

    private async UnknownUserSub(accessToken): Promise<User> {
        let data = await UserService.GetAdditionalUserInfo(accessToken);
        if (!data) return null;
        let user: User;

        user = this.FindOne(u => u.email == data['email']);
        if (user) {
            user.subs.push(data.sub);
        } else {
            user = this.CreateItem(new ObjectId());
            user.sub = data.sub;
            user.email = data.email;
            user.role = 'default';
            user.profilpic = data.picture;
            user.logs = [];
            user.subs = [data.sub];

            user.currentFamilyId = user.GetCurrentFamily().Id.toHexString();
        }
        await user.RefreshDependenciesToPrimarySub();
        return user;
    }


    public static async GetAdditionalUserInfo(accessToken: string): Promise<any> {
        const endpoint = "https://kukta.eu.auth0.com/userinfo";
        return new Promise((resolve, reject) => {
            const options = {
                method: 'GET',
                uri: `${endpoint}?access_token=${accessToken}`,
                json: true,
            };
            let req = request(options, (err, res, body) => {
                if (err) {
                    console.error(`Error when get user info from auth0: ${err.toString()}`);
                    reject(null);
                    return;
                }
                resolve(body);
            })
        });
    }

}
