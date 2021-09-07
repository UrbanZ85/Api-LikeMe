import { encode, TAlgorithm } from "jwt-simple";
import { Session, PartialSession, EncodeResult } from "../../Models/jwtModel";


export function encodeSession(secretKey: string, partialSession: PartialSession): EncodeResult {
    // Always use HS512 to sign the token
    const algorithm: TAlgorithm = "HS512";
    // Determine when the token should expire
    const issued = Date.now();
    const exp = 15 * 60 * 1000;
    const expires = issued + exp;
    const session: Session = {
        ...partialSession,
        issued: issued,
        expires: expires
    };

    return {
        token: encode(session, secretKey, algorithm),
        issued: issued,
        expires: expires
    };
}