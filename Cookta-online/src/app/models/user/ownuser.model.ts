import {User} from './user.model';

export class OwnUser extends User {
  public AccessToken: string;
  public Role: string;
  public Email: string;
  public Permissions: string[];
}
