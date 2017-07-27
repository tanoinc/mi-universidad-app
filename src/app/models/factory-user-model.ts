import { UserModel } from "./user-model";
import { UserFacebookModel } from "./user-facebook-model";
import { UserMobileModel } from "./user-mobile-model";
import { Auth } from "../../providers/auth";


export class FactoryUserModel {
    static readonly ORIGIN_FACEBOOK = "facebook";
    static readonly ORIGIN_MOBILE = "mobile";

    public static create(user_data: any, auth: Auth): UserModel {
        if (user_data.origin == FactoryUserModel.ORIGIN_FACEBOOK) {
            return new UserFacebookModel(user_data, auth);
        } else if (user_data.origin == FactoryUserModel.ORIGIN_MOBILE) {
            return new UserMobileModel(user_data, auth);
        }
    }
}