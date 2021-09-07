import { EnvConfig } from '../Models/Enviroment';
import envConfig from '../util/config.json'; 

let env;
if (process.env.NODE_ENV === 'prod'){
    env = envConfig[1];
}
else{
    env = envConfig[0];
}

export default env as EnvConfig