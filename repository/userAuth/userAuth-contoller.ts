import UserAuthRrepository from './userAuth-repository';
import express from 'express';
//const liteContext = require('../../Database/liteContext');

class UserAuthContoller{
    /* public path = '/'; */
    public router = express.Router();
    public userAuthRrepository = UserAuthRrepository();

    constructor() {
        this.intializeRoutes();
      }

    public intializeRoutes() {
    this.router.post('/signup', this.userAuthRrepository.signUp);
    this.router.post('/login', this.userAuthRrepository.logIn);
    this.router.post('/me', this.userAuthRrepository.userSettings);
    this.router.post('/me/update-password', this.userAuthRrepository.updatePassword);
    }

}
export default UserAuthContoller