import {IUser, IUserDTO} from '../../Models/User';
import User from '../../DataBase/Schemas/UserDB';
import bcrypt from 'bcrypt'
const saltRounds = 12;
import Responses from '../../_helpers/Responses/response'
import InnerResponses from '../../_helpers/Responses/inner-response'
import { encodeSession } from "../../_helpers/JWT/encodeSession";
import env from '../../Enviroment/enviroment';

function UserAuthRepository(){
    const responses = Responses();
    const innerResponses = InnerResponses();
    const SECRET_KEY = env.Config.JWT.secret;

    async function userSettings(req :any, res : any, next: any) {
        const UserId = req.body.UserId;
        const user = await getUserById(UserId)
                                  .then((result: IUser) => {return result})
                                  .catch(err=> {return undefined})

        if (req){
            res.status(200).send(responses.Response('OK!', [removePasswordFromUser(user)]));
            return
        }
        else{
            res.status(400).send(responses.ResponseNoData("Error! No params send"));
            return
        }
    }

    async function updatePassword(req :any, res : any, next: any) {
        if (req){
            const UserName = req.body.UserName;
            const OldPassword = req.body.OldPassword;
            const Password1 = req.body.NewPassword1;
            const Password2 = req.body.NewPassword2;
            //Check old password
            if(Password1 !== Password2)
            {
                res.status(400).send(responses.ResponseNoData("Passwords not matched!"));
                return
            }
            CheckPassword(UserName, OldPassword)
            .then(result => {
                if(result.Data[0].granted === 1){
                    bcrypt.hash(Password1, saltRounds, function (err :any,   hash: any) {   
                        if(err){
                         res.status(500).send(responses.ResponseNoData(err));
                         return
                        }
                        const filter = { UserName: UserName };
                        const update = { Password: hash };
                        let userPasswordUpdated = User.findOneAndUpdate(filter, update,{
                            new: true,
                            useFindAndModify: true
                          },function(err, doc) {
                            if(err) {
                                res.status(400).send(responses.ResponseNoData(err.toString()));
                                return
                            }
                        });
                    });
                    res.status(200).send(responses.Response("OK!", result.Data[0].user));
                    return
                }
            })
            .catch(err=> {
                res.status(400).send(responses.ResponseNoData(err));
            });
            /* res.status(400).send(responses.ResponseNoData("Password not changed!"));
            return */
        }
        else{
            res.status(400).send(responses.ResponseNoData("Error! No params send"));
            return
        }
    }
    function getUserById(UserID: String): Promise<any>{
        return new Promise(function (resolve, reject) {
            User.findOne({'_id': UserID}, function (err :string, user: any) {
                if(user !== null){
                    resolve(user._doc);
                    return
                }
                else{
                    reject(err);
                    return
                }
            });
        });
    }

    function getUserByUserName<IUser>(UserName: string): Promise<IUser>{
        return new Promise(function (resolve, reject) {
            User.findOne({'UserName': UserName}, function (err :string, user: any) {
                if(user !== null){
                    resolve(user._doc);
                    return
                }
                else{
                    reject('No user found');
                    return
                }
            });
        });
    }

    function removePasswordFromUser<IUserDTO>(user?: IUser) {
        if (user != null){
            const {Password: string, ...userNoPassword} = user;
            return userNoPassword; 
        }
        else
            return [];
    }

    async function CheckPassword(userName : string, password: string){
        return new Promise<any>(async function (resolve, reject) {
            getUserByUserName(userName)
            .then((user: any) => {
                if (user){
                    bcrypt.compare(password, user.Password || '', function (err, result) {
                        if (result === true) {
                            resolve(innerResponses.InnerResponse('Passwors is a match!', [{"granted": 1, "user": removePasswordFromUser(user)}]));
                            return true;
                        } else { 
                            resolve(innerResponses.InnerResponse('Password does not match!', [{"granted": 0}])); 
                            return false
                        }
                    });
                }
            })
            .catch((err)=>{
                reject(err);
             });
        });
    }

    return {
        userSettings: userSettings,
        updatePassword: updatePassword
      }
}

export default UserAuthRepository;