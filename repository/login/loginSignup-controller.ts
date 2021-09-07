import LoginSignupRrepository from './loginSignup-repository';
import express from 'express';

//https://wanago.io/2018/12/03/typescript-express-tutorial-routing-controllers-middleware/
//const liteContext = require('../../Database/liteContext');

class LoginSignupContoller{
    /* public path = '/'; */
    public router = express.Router();
    public loginSignupRrepository = LoginSignupRrepository();

    constructor() {
        this.intializeRoutes();
      }

    public intializeRoutes() {
      this.router.post('/signup', this.loginSignupRrepository.signUp);
      this.router.post('/login', this.loginSignupRrepository.logIn);
    }

}
export default LoginSignupContoller