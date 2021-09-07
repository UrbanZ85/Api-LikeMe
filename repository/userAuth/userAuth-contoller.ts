import UserAuthRrepository from './userAuth-repository';
import express from 'express';

//https://wanago.io/2018/12/03/typescript-express-tutorial-routing-controllers-middleware/
//const liteContext = require('../../Database/liteContext');

class UserAuthContoller{
    /* public path = '/'; */
    public router = express.Router();
    public userAuthRrepository = UserAuthRrepository();

    constructor() {
        this.intializeRoutes();
      }

    public intializeRoutes() {
    this.router.post('/me', this.userAuthRrepository.userSettings);
    this.router.post('/me/update-password', this.userAuthRrepository.updatePassword);
    }

}
export default UserAuthContoller