import { UserModel } from "./user-model";
import { Auth } from "../../providers/auth";
import md5 from 'crypto-md5';
import { CONFIG } from "../../config/config";

export class UserMobileModel extends UserModel {

    public getProfilePicture() {
        return "https://www.gravatar.com/avatar/" + md5(this.email.toLowerCase(), 'hex')+'?s='+CONFIG.GRAVATAR_SIZE+'&d='+CONFIG.GRAVATAR_DEFAULT;
    }

    
    public getProfileChangePictureURL() {
        return "https://www.gravatar.com/profiles/edit";
    }

    constructor(user_data: any, auth: Auth) {
        super(user_data, auth);
    }

    public logout() {
        return this.auth.logout();
    }    
}