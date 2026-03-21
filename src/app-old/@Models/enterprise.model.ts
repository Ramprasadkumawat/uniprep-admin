export interface enterpriseResponse {
    list:Root[],
    success:string
  }

export interface Root {
    subscription_manager_id: number,
    institutename: string,
    institute_id:number,
    plan_id:number,
    plan_name: string,
    order_link: string,
    price: string,
    limits: number,
    totalprice: string,
    payment_status: string,
    payment_action: number,
    validity:number
  }
export interface enterprisePayload{
    college_id:number,
    subscriptiontype_id:number,
    limit:string,
    price:string,
    totalprice:string,
    validity:number
}
export interface updateEnterprisePayload{
    college_id:number,
    subscriptiontype_id:number,
    limit:string,
    price:string,
    totalprice:string,
    validity:number,
    subscription_manager_id:number
}
