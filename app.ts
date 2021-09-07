import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import header from './_helpers/header/header'
import connect from "./DataBase/connect";
import { requireJwtMiddleware } from "./_helpers/JWT/jwtMiddleware";
import LoginSignupContoller from './repository/login/loginSignup-controller';

class App {
  public app: express.Application;
  public port: number;
  public options: any;
 
  constructor(controllers: any, port: number) {
    this.app = express();
    this.port = port;
     
 
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }
 
  private initializeMiddlewares() {
    const CorsOptions = header;
    this.app.use(bodyParser.json());
    this.app.use(cors(CorsOptions));
    const loginSignupController = new LoginSignupContoller()
    this.app.use('/', loginSignupController.router);
    this.app.use(requireJwtMiddleware);
  }
 
  private initializeControllers(controllers: any) {
    controllers.forEach((controller: any) => {
      this.app.use('/', controller.router);
    });
  }
 
  public listen() {
    this.app.listen(this.port, () => {
      connect();
      console.log(`App listening on the port ${this.port}`);
    });
  }
}
 
export default App;