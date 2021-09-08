import { DecodeResult  } from "../../Models/jwtModel";
import { Request, Response } from "express";

import { decodeSession } from './decodeSession';
import env from '../../Enviroment/enviroment';

export default function DecodeHeader(req: Request): DecodeResult {

    const requestHeader = "Authorization";
    const header = req.header(requestHeader);
    const SECRET_KEY = env.Config.JWT.secret;
    let decodedSession: DecodeResult;

    if (header !== undefined){
        decodedSession = decodeSession(SECRET_KEY, header);
        return decodedSession;
    }
    decodedSession = {type: "invalid-token"};
    return decodedSession;
}