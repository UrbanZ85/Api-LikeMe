// https://www.pullrequest.com/blog/intro-to-using-typescript-in-a-nodejs-express-project/
//https://tomanagle.medium.com/build-a-rest-api-with-node-js-typescript-mongodb-b6c898d70d61

import App from './app';
import UserAuthContoller from './repository/userAuth/userAuth-contoller'
import UserLikeAppContoller from './repository/userLikeApp/userLikeApp-contoller';

const app = new App(
    [
      new UserAuthContoller(),
      new UserLikeAppContoller(),
    ],
    3000,
  );
   
  app.listen();