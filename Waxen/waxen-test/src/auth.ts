import {User} from "./models/user.model";

export function authenticate(req: any, anonymous: boolean, ...permissions: string[]): Promise<User>{
    return new Promise<User>((resolve, reject) => {
        if (permissions[0] == 'ok'){
            let user = new User();
            user.name = 'Heghehe';
            user.lastLogin = 50;
            resolve(user);
        }else if (permissions[0] == 'fail' && anonymous){
            let user = new User();
            user.name = 'Spooky scary sceleton';
            user.lastLogin = 50
            let error = new Error('User not found');
            error['status'] = 404;
            throw error;
            resolve(user);
        }else {
            let error = new Error('User not found');
            error['status'] = 404;
            throw error;
            reject('Not authenticated.');
        }
    });
}
