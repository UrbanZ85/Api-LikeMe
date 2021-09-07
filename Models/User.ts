
import {ILike} from '../Models/Like';

export interface IUser {
    UserName: string;
    FirstName: string;
    LastName: string;
    Password: string;
    FullName?: string;
    UserCreated?: Date;
    Likes?: ILike[];
}

export interface IUserDTO {
    UserName: string;
    FirstName: string;
    LastName: string;
    FullName?: string;
    UserCreated?: Date;
    Likes?: ILike[];
}