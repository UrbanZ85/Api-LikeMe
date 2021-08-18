import UserLikeApp from './userLikeApp-repository';
import express from 'express';
//const liteContext = require('../../Database/liteContext');

class UserLikeAppContoller{
    /* public path = '/'; */
    public router = express.Router();
    public userLikeApp = UserLikeApp();

    constructor() {
        this.intializeRoutes();
      }

    public intializeRoutes() {
    this.router.get('/user/:id', this.userLikeApp.userData);
    this.router.get('/user/:id/like', this.userLikeApp.likeUnlikeUser);
    this.router.get('/user/:id/unlike', this.userLikeApp.likeUnlikeUser);
    this.router.get('/most-liked', this.userLikeApp.mostLiked);
    }

}
export default UserLikeAppContoller