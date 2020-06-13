import {StoreService} from 'atomik/lib/store-service/store-service';
import {User} from '../../models/user.model';
import {ObjectId} from 'bson';
import * as request from 'request';


export class UserService extends StoreService<User> {

    public async GetUserForAuth(sub: string, accessToken): Promise<User> {
        let user: User;
        user = this.FindOne(u => u.sub == sub || (u.subs ? u.subs.includes(sub) : false));
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
            user.username = data.username ?? data.nickname;
            while (!user.username) {
                let t = 'user' + Math.floor(Math.random() * 90000) + 9999;
                if (this.FindOne(u => u.username == t)) continue;
                user.username = t;
            }
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

    public ChangeRole(sub: string, roleId: string){
        let user = this.FindOne(u => u.sub == sub);
        user.role = roleId;
        this.SaveItem(user);
    }

    public async DeleteUser(user: User) {
        /*let families: Family[] = Services.FamilyService.GetUserRelatedFamilies(user);
        for (let family of families) {
            Services.FamilyService.LeaveFamily(user.sub, user.sub, family.Id.toHexString());
        }

        let subs = await Subscription.GetAll();
        subs = subs.filter(s => s.userSub == user.sub);
        for (let sub of subs) {
            await Subscription.SetUserSubState(user, sub.foodId, false);
        }

        let foods = Services.FoodService.GetAllOwnFoods(user.sub);
        foods.forEach(f => Services.FoodService.Delete(f.foodId, user.sub));

        this.RemoveItem(user);*/
        this.DeleteAuth0UsersByEmail(user.email);
    }


    async DeleteAuth0UsersByEmail(email: string) {
        let request = require('request');

        var options = {
            method: 'POST',
            url: 'https://kukta.eu.auth0.com/oauth/token',
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            form: {
                grant_type: 'client_credentials',
                client_id: 'F4WWdOxBUCTqS1KiEl1uMU07vFigXkOW',
                client_secret: process.env.AUTH0SECRET,
                audience: 'https://kukta.eu.auth0.com/api/v2/'
            }
        };

        let token = await new Promise((resolve, reject) => {
            request(options, function(error, response, body) {
                if (error) reject(error);
                else resolve(body['access_token']);
                return;
            });
        });

        let userIds = await new Promise(((resolve, reject) => {
            var options = {
                method: 'GET',
                url: 'http://kukta.eu.auth0.com/api/v2/users-by-email',
                headers: {'content-type': 'application/json', authorization: `Bearer ${token}`}
            };
            request(options, function(error, response, body) {
                if (error) reject();
                body = body as any[];
                console.log(body);
                resolve(body.map(u => u['user_id']));
            });
        }));
        console.log(userIds);
    }

}
