import { ObjectID } from "mongodb";
import {MongoHelper} from "../helpers/mongo.helper";
import {Role} from "./role.model";
import * as jwt from 'jsonwebtoken';
import * as request from "request";


export class User {
    private static readonly CollectionName = 'Users';


    constructor (
        public _id: string = new ObjectID().toHexString(),
        public sub: string,
        public subs: string[] = [sub],
        public username: string,
        public role: string = 'default',
        public email: string,
        public logs: {time: number, text: string}[],
        public families: string,
        public profilpic: string,
        ) {}

    public HasPermission(permission: string): boolean{
        let role = this.GetRole();
        return role.permissions.includes(permission);
    }

    public static async GetUser(sub){
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let doc = await collection.findOne({sub: sub});
        if (!doc){
            let array = await collection.find({}).toArray();
            doc = array.find(d => d.subs ? d.subs.includes(sub) : false);
        }
        return doc ? this.FromDocument(doc) : null;
    }

    public static async NewUserOrSub(accessToken): Promise<User>{
        let data = await this.GetAdditionalUserInfo(accessToken);
        if (!data) return null;
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let user: User;
        let alreadyExistRecord = await collection.findOne({ email: data['email']});
        if (alreadyExistRecord){
            user = this.FromDocument(alreadyExistRecord);
            user.subs.push(data.sub);
        }else{
            user = new User(
                undefined,
                data.sub,
                [data.sub],
                undefined,
                undefined,
                data.email,
                [],
                undefined,
                data.picture
            )
        }
        await collection.replaceOne({sub: user.sub}, user.ToDocument());
        return user;
    }

    public static async FetchUser(accessToken: string): Promise<User>{
        const decoded = jwt.decode(accessToken, {complete: true});
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let user = await this.GetUser(decoded.payload['sub']);
        if (!user){
            user = await this.NewUserOrSub(accessToken);
            if (!user)
                return null;
        }
        if (!user.email) {
            let data = await this.GetAdditionalUserInfo(accessToken);
            user.email = data['email'];
            user.profilpic = data['picture'];
            await collection.replaceOne({_id: user._id}, user.ToDocument(), {upsert: true});
            await this.MergeSameEmailUsers(user.email);
        }
        if (!user.subs.includes(user.sub)){
            user.subs.push(user.sub);
            await collection.replaceOne({_id: user._id}, user.ToDocument(), {upsert: true});
        }
        return user;
    }

    public static async GetAdditionalUserInfo(accessToken: string): Promise<any>{
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

    public static async MergeSameEmailUsers(email: string){
        if (!email)
            return;
        let collection = await MongoHelper.getCollection(this.CollectionName);
        let array = await collection.find({email: email}).toArray();
        if (array.length <= 1) {
            return;
        }
        let oldUsers: User[] = [];
        for (let element of array) {
            oldUsers.push(this.FromDocument(element));
        }
        let newUser: User = oldUsers[0];
        oldUsers.shift();
        for (let user of oldUsers) {
            for (let sub of user.subs){
                if (!newUser.subs.includes(sub))
                    newUser.subs.push(sub);
            }
            await collection.deleteOne({_id: user._id});
        }
        await collection.replaceOne({_id: newUser._id}, newUser.ToDocument(), {upsert: true});
    }

    private GetRole(): Role{
        return Role.GetRole(this.role);
    }

    private ToDocument(): any {
        return {
            _id: this._id,
            sub: this.sub,
            subs: this.subs,
            username: this.username,
            role: this.role,
            email: this.email,
            logs: this.logs,
            families: this.families,
            profilpic: this.profilpic
        }
    }
    private static FromDocument(document): User {
        return new User(
            document['_id'],
            document['sub'],
            document['subs'],
            document['username'],
            document['role'],
            document['email'],
            document['logs'],
            document['families'],
            document['profilpic']
        )
        ;
    }
}