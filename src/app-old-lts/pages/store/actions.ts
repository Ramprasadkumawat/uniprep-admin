import {createAction, props} from "@ngrx/store";
import {CreateUserParams, LoadUserParams, UserPaginatedresponse, UserType} from "../../@Models/user.model";
import {SubscriptionPlan, SubscriptionPlanResponse, QuestionCreditPlanResponse} from "../../@Models/subscription";
import { Subscriber, SubscriberData } from "src/app/@Models/subscribers.model";

const subscriptionKey = '[SUBSCRIPTION]';

// Subscription page
export const loadUserList = createAction('[USERS] Load user list', ((payload: {data: LoadUserParams}) => payload));
export const loadUserListSuccess = createAction('[USERS] Load user list success', ((payload: {data: UserPaginatedresponse}) => payload));

export const loadUserTypes = createAction('[USERS] Load user types');
export const loadUserTypesSuccess = createAction('[USERS] Load user types success', ((payload: {data: UserType[]}) => payload));

export const createUser = createAction('[USERS] Create user', ((payload: {data: CreateUserParams}) => payload));


// subscription

export const addSubscription = createAction(`${subscriptionKey} Add Subscription`, ((payload: {data: SubscriptionPlan}) => payload));
export const loadSubscriptionPlans = createAction(`${subscriptionKey} load subscription plans`);
export const loadSubscriptionPlansSuccess = createAction(`${subscriptionKey} load subscription plans success`, (payload: {subscriptions: SubscriptionPlanResponse}) => payload);

export const loadQuestionCreditPlans = createAction(`${subscriptionKey} load question credit plans`);
export const loadQuestionCreditSuccess = createAction(`${subscriptionKey} load question credit plans success`, (payload: {subscriptions: QuestionCreditPlanResponse}) => payload);


export const addSubscriptionPlan = createAction(`${subscriptionKey} add subscription plans`);
export const addSubscriptionPlanSuccess = createAction(`${subscriptionKey} add subscription plans success`, (payload: {subscriptions: QuestionCreditPlanResponse}) => payload);

export const deleteSubscription = createAction(`${subscriptionKey} Delete Subscription`, ((payload: {data: any}) => payload));
export const deleteSubscriptionSuccess = createAction(`${subscriptionKey} delete subscription list success`, ((payload: {data: any}) => payload));

/* -------------------- Subscribers -------------------- */
const subscribersKey = '[SUBSCRIBERS]';

export const loadSubscribers = createAction(
  `${subscribersKey} Load Subscribers`,
  (payload: { params: any }) => payload        
);

export const loadSubscribersSuccess = createAction(
  `${subscribersKey} Load Subscribers Success`,
  (payload: { data: SubscriberData }) => payload
);

export const loadSubscribersFailure = createAction(
  `${subscribersKey} Load Subscribers Failure`,
  (payload: { error: any }) => payload
);
export const clearSubscribers = createAction('[SUBSCRIBERS] Clear Subscribers');

