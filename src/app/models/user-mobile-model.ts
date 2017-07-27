import { UserModel } from "./user-model";
import { Auth } from "../../providers/auth";

export class UserMobileModel extends UserModel {

    public getProfilePicture() {
        return null;
    }

    constructor(user_data: any, auth: Auth) {
        super(user_data, auth);
    }

    public logout() {
        return this.auth.logout();
    }    
}