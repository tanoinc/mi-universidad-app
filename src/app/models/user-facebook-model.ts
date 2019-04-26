import { UserModel } from "./user-model";
import { Auth } from "../../providers/auth";
import { Facebook } from "@ionic-native/facebook";

export class UserFacebookModel extends UserModel {

    protected profile_picture_url: string;
    protected facebook: Facebook;
    protected facebook_profile: any;

    constructor(user_data: any, auth: Auth) {
        super(user_data, auth);
        this.facebook = auth.getFacebook();
        this.retrieveFacebookProfile();
    }

    protected retrieveFacebookProfile() {
        this.facebook.api("/me?fields=picture.type(large)", []).then((data)=>{
            this.facebook_profile = data;
            this.profile_picture_url = data.picture.data.url;
            console.log("Facebook data: "+JSON.stringify(data.picture));
        });
    }

    public getProfilePicture() {
        return this.profile_picture_url;
    }

    public getProfileChangePictureURL() {
        return "https://www.facebook.com/me";
    }

    public logout() {
        return this.auth.logoutFacebook();
    }    
}