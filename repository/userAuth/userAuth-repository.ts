import User,{IUser, IUserDTO} from '../../Models/User';
import bcrypt from 'bcrypt'
const saltRounds = 12;
import config from '../../util/config.json'
import Responses from '../../_helpers/Responses/response'
import InnerResponses from '../../_helpers/Responses/inner-response'

function UserAuthRepository(){
    const responses = Responses();
    const innerResponses = InnerResponses();

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
            
            const granted = await CheckPassword(UserName, Password);
            if( granted && granted.Data[0].granted === 1){
                res.status(200).send(responses.Response('OK!', granted.Data[0].user));
                return
            }
            else{
                res.status(400).send(responses.ResponseNoData(granted.Message));
                return
            }
        }
        else{
            res.status(400).send(responses.ResponseNoData("Error! No params send"));
            return
        }
    }

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
            const granted = await CheckPassword(UserName, OldPassword).then(result => {return result}).catch(err=> {return null});
            if( granted && granted.Data[0].granted === 1){
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
                res.status(200).send(responses.Response("OK!", granted.Data[0].user));
                return
            }
            else{
                res.status(400).send(responses.ResponseNoData(granted.Message));
                return
            }
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
                    reject(err);
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
            const user: IUser = await getUserByUserName(userName);
            if (user !== null && user.UserName){
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
            else{ 
                resolve(responses.ResponseNoData('No user found!')); return}
        });
    }

    return {
        signUp: signUp,
        logIn: logIn,
        userSettings: userSettings,
        updatePassword: updatePassword
      }
}

export default UserAuthRepository;