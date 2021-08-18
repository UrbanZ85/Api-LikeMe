function Responses(){
    function Response(message: string, data: any[]): any{
    
        return {Message: message, Data: data}
    }
    
    function ResponseNoData(message: string): any{
        
        return {Message: message}
    }

return {
    Response: Response,
    ResponseNoData: ResponseNoData
  }
}

export default Responses;