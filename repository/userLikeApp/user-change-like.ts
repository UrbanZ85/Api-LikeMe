import { IUser, IUserDTO } from "../../Models/User";
import User from '../../DataBase/Schemas/UserDB';
import {ILike} from '../../Models/Like';

export class UserChangeLike{
    private strategy: Strategy;

    constructor(strategy: Strategy) {
        this.strategy = strategy;
    }

    public setStrategy(strategy: Strategy) {
        this.strategy = strategy;
    }

    public changeToLikeOrUnlike(userId: string, likedUnlikeUserId:string): void {
        console.log(likedUnlikeUserId)
        this.strategy.changeLike(userId, likedUnlikeUserId);
    }
}
export interface Strategy {
    changeLike(userId: string, likedUnlikeUserId:string): any;
}

export class LikeMe implements Strategy {
    public changeLike = async(userId: string, likedUnlikeUserId:string) => {
        User.findOne({ '_id': likedUnlikeUserId })
        .exec((err, user) => {
          if (user){
            let userFound = false;
            user?.Likes?.forEach(el => {
                if (el.UserLikedId == userId){
                    if (el.Like === false)
                    el.Like = likeToggle(el.Like);
                    userFound = true;
                    return;
                }
            });
            if(!userFound){
                    user?.Likes?.push({'UserLikedId':userId, 'Like': true})
            }
            user.save(function (err) {
                if(err) {
                    console.error('ERROR!');
                }
            });
          }
        })
    }
}

function likeToggle(lIke: boolean){
    return !lIke;
}

export class UnlikeMe implements Strategy {
    public changeLike = async (userId: string, likedUnlikeUserId:string) => {
        User.findOne({ '_id': likedUnlikeUserId })
        .exec((err, user) => {
          if (user){
            let userFound = false;
            user?.Likes?.forEach(el => {
                if (el.UserLikedId == userId){
                    if (el.Like === true)
                        el.Like = likeToggle(el.Like);
                    userFound = true;
                    return;
                }
            });
            if(!userFound){
                user?.Likes?.push({'UserLikedId':userId, 'Like': false})
            }

            user.save(function (err) {
                if(err) {
                    console.error('ERROR!');
                }
            });
          }
        })
    }
}

function getUserById(UserID: string): Promise<IUser>{
    return new Promise(function (resolve, reject) {
        User.findById(UserID, function (err: any, user: any) {
            if(user !== null){
                resolve(user);
                return
            }
            else{
                reject(err);
                return
            }
        });
    });
}