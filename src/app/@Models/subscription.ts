export interface SubscriptionPlan {
    id: number;
    subscription_type: number;
    subscription_plan: string;
    actualprice: string;
    discountpercentage: number;
    givenprice: string;
    validityFrom: string;
    validityTo: string;
    validity: number;
    currency: string;
    country: string;
    chatlimit: number;
    couponcode: number;
    status: number;
    created_at: any;
    updated_at: any;
    subtypeName: string;
    countryrestriction: number;
    popular: number;
    subscription_plan_id:number;
}

export interface SubscriptionPlanResponse {
    success: boolean;
    subscriptions: SubscriptionPlan[];
    count: number;
}

export interface SubscriptionPlanSuccessResponse {
    success: boolean;
    message: string;
}

export interface QuestionCreditPlan {
    id: number;
    name: string;
    price: string;
    discount_type: string;
    discount: string;
    questions_count: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface QuestionCreditPlanResponse {
    success: boolean;
    questioncredits: QuestionCreditPlan[];
}

export interface PlaceOrderResponse {
    orderid: string;
}

export interface SubscriptionDetailResponse {
    billinginfo: Billinginfo;
    subscription: Subscription;
    orderHistory: OrderHistory[];
}

export interface Billinginfo {
    name: string;
    mobile: string;
    email: string;
    country: string;
    location: string;
}

export interface OrderHistory {
    subscriptionName: string;
    refrence: string;
    created_at: Date;
    amount: string;
    payment: number;
    id: number;
    date: string;
    orderId: number;
}

export interface Subscription {
    name: string;
    checks: number;
    price: string;
    desc: string[];
    checksLeft: number;
}


export interface SubscriptionSuccess {
    refrenceid: string;
    orderid: string;
    orderdate: string;
    subtotal: string;
    total: string;
    subscriptionname: string;
    subscriptionamount: string;
}

export type SubscriptionTypesData = SubscriptionType[];

export interface SubscriptionType {
  id: number;
  subtypeName: string;
  status: number;
  created_at: any;
  updated_at: any;
}

// Params

export interface SubscriptionParams {
    subscriptionType: string;
    subscriptionPlan: string;
    actualPrice: string;
    validityFrom: string;
    validityTo: string;
    country: string;
    chatLimit: string;
    couponCode: string;
    discountPercentage: string;
    givenPrice: string;
    countryrestriction: string;
}