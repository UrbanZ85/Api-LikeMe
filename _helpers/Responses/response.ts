import { EncodeResult } from "../../Models/jwtModel";

function Responses(){
    function Response(message: string, data: any[], session?: EncodeResult): any{
    
        return {Message: message, Data: data, session}
    }
    
    function ResponseNoData(message: string, session?: EncodeResult): any{
        
        return {Message: message}
    }

return {
    Response: Response,
    ResponseNoData: ResponseNoData
  }
}

export default Responses;