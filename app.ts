import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import header from './_helpers/header/header'
import connect from "./DataBase/connect";

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