import {IUser, IUserDTO} from '../../Models/User';
import User from '../../DataBase/Schemas/UserDB';
import bcrypt from 'bcrypt'
const saltRounds = 12;
import Responses from '../../_helpers/Responses/response'
import InnerResponses from '../../_helpers/Responses/inner-response'
import { encodeSession } from "../../_helpers/JWT/encodeSession";
import env from '../../Enviroment/enviroment';
import moment from 'moment';

function UserAuthRepository(){
    const responses = Responses();
    const innerResponses = InnerResponses();
    const SECRET_KEY = env.Config.JWT.secret;

    async function signUp(req :any, res : any, next: any) {
        if (req){
            const UserName = req.body.UserName;
            const FirstName = req.body.FirstName;
            const LastName = req.body.LastName;
            const Password1 = req.body.Password1;
            const Password2 = req.body.Password2;
            const user = await getUserByUserName(UserName).then(result => {return result}).catch(err=> {return null});
            if(user){
                res.status(400).send(responses.ResponseNoData("User already created!"));
                return
            }

            if(Password1 !== Password2)
            {
                res.status(400).send(responses.ResponseNoData("Passwords not matched!"));
                return
            }
            bcrypt.hash(Password1, saltRounds, function (err :any,   hash: any) {   
                if(err){
                 res.status(500).send(responses.ResponseNoData(err));
                 return
                }
                
                const user = new User({UserName: UserName, FirstName: FirstName, LastName: LastName, Password: hash})
                user.save()
                .then((result: any) => {
                    res.status(200).send(responses.ResponseNoData("User Created!"));
                    return
                })
                .catch((err: any) =>{
                    res.status(400).send(responses.ResponseNoData("Error saving user!"));
                    return
                });
                return
            });
        }
        else{
            res.status(400).send(responses.ResponseNoData("Error! No params send"));
            return
        }
    }

    async function logIn(req :any, res : any, next: any) {
        if (req){
            const UserName = req.body.UserName;
            const Password = req.body.Password;
            const granted = await CheckPassword(UserName, Password)
            .then((granted) =>{
                if(granted.Data[0].granted === 1){

                    const session = encodeSession(SECRET_KEY, {
                        id: granted.Data[0].user._id,
                        username: granted.Data[0].user.UserName,
                        dateCreated: Number(Date.now()),        
                    });

                    res.status(200).send(responses.Response('OK!', [], session));
                    return
                }
                else{
                    res.status(400).send(responses.ResponseNoData(granted.Message));
                    return
                }
            })
            .catch((err) =>{
                res.status(400).send(responses.ResponseNoData(err));
            });
        }
        else{
            res.status(400).send(responses.ResponseNoData("Error! No params send"));
            return
        }
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
        signUp: signUp,
        logIn: logIn
      }
}

export default UserAuthRepository;