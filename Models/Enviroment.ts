export interface EnvConfig {
    Enviroment: string;
    /* Host: Host; */
    Config: Config;
  }

/* export interface Host {
    protocol: string;
    hostname: string;
    port: number | string;
  } */

export interface Config {
    JWT: JWT;
    mongoDb: MongoDb;
  }

export interface JWT {
    secret: string;
    iss: string;
    audience: string;
  }

export interface MongoDb {
    MONGO_USER: string;
    MONGO_PASSWORD: string;
    MONGO_PATH: string;
  }