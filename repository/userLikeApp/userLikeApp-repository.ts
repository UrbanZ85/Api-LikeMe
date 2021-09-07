import { IUser, IUserDTO } from "../../Models/User";
import User from '../../DataBase/Schemas/UserDB';
import Responses from '../../_helpers/Responses/response'
import {UserChangeLike, LikeMe, UnlikeMe} from './user-change-like';

function UserLikeAppRepository(){
    const responses = Responses();
    const userChange = new UserChangeLike(new LikeMe());

    async function userData(req :any, res : any, next: any) {
        if (req){
            const userId = req.params.id
            const userLikes:IUserDTO = await getUserById(userId, {'UserName':1, '_id':1, 'Likes':1})

            res.status(200).send(responses.Response("OK!",[userLikes]));
        }
        else{
            res.status(400).send({"message" : "Error! No params send"});
        }
    }
    function likeUnlikeUser(req :any, res : any, next: any) {
        const userId = '610afc1e21c3064d6cfdff52'//req.params.userId
        const likedUnlikeUserId = req.params.id

        //console.log(likedUnlikeUserId)
        const method = (req.route.path).split("/").pop();
        //console.log(method)
        if (method === 'like'){
            userChange.setStrategy(new LikeMe);
            userChange.changeToLikeOrUnlike(userId, likedUnlikeUserId);
        }
        else if (method === 'unlike'){
            userChange.setStrategy(new UnlikeMe);
            userChange.changeToLikeOrUnlike(userId, likedUnlikeUserId);
        }

        //https://betterprogramming.pub/design-patterns-using-the-strategy-pattern-in-javascript-3c12af58fd8a
        //strategy patern

        if (req){
            res.status(200).send({"message" : "User "+ method});
        }
        else{
            res.status(400).send({"message" : "Error! No params send"});
        }
    }

    function mostLiked(req :any, res : any, next: any) {
        if (req){
            User.aggregate([ 
                {$unwind: '$Likes'},
                 { $match : { 'Likes.Like' : true } } , 
                { $group : {  _id : { name: '$UserName'}, count: { $sum: 1 } } },
                { $sort: {count: -1}}
              ], function(err :any, docs :any) {
                res.status(200).send(responses.Response("OK!", [docs.map( (x: any) => { return {UserName: x._id.name, Count:x.count}})]));
              });

        }
        else{
            res.status(400).send({"message" : "Error! No params send"});
        }
    }

    function getUserById(UserID: String, fields: object): Promise<IUser>{
        return new Promise(function (resolve, reject) {
            User.findById(UserID,fields,{}, function (err, user) {
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

    return {
        userData: userData,
        likeUnlikeUser:likeUnlikeUser,
        mostLiked: mostLiked
      }
}

export default UserLikeAppRepository;