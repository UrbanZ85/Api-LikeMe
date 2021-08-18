function InnerResponses(){
    function InnerResponse(message: string, data: any[]): any{
    
        return {Message: message, Data: data}
    }
    
    function InnerResponseNoData(message: string): any{
        
        return {Message: message}
    }

return {
    InnerResponse: InnerResponse,
    InnerResponseNoData: InnerResponseNoData
  }
}

export default InnerResponses;