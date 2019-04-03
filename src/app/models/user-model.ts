import { Auth } from "../../providers/auth";

export abstract class UserModel {
    protected username: string;
    protected name: string;
    protected surname: string;
    protected email: string;
    protected hash_id: string;
    protected created_at: Date;
    protected updated_at: Date;
    protected origin: string;

    constructor(user_data: any, protected auth: Auth) {
        this.username = user_data.username;
        this.name = user_data.name;
        this.surname = user_data.surname;
        this.email = user_data.email;
        this.hash_id = user_data.email;
        this.created_at = user_data.created_at;
        this.updated_at = user_data.created_at;
        this.origin = user_data.origin;
    }

    public getName() {
        return this.name;
    }

    public getSurname() {
        return this.surname;
    }

    public getEmail() {
        return this.email;
    }

    public abstract getProfilePicture();

    public getProfileChangePictureURL() {
        return null;
    }

    public hasProfilePicture() {
        return (this.getProfilePicture() != null);
    }

    public abstract logout();
}