import { createReducer, on } from "@ngrx/store";
import { User, UserType } from "../../@Models/user.model";
import {
    addSubscriptionPlan,
    addSubscriptionPlanSuccess,
    clearSubscribers,
    loadQuestionCreditPlans,
    loadQuestionCreditSuccess,
    loadSubscribers,
    loadSubscribersFailure,
    loadSubscribersSuccess,
    loadSubscriptionPlans,
    loadSubscriptionPlansSuccess,
    loadUserList,
    loadUserListSuccess,
    loadUserTypesSuccess
} from "./actions";
import { QuestionCreditPlan, SubscriptionPlan } from "src/app/@Models/subscription";
import { FAQMainResponse } from "../../@Models/faq.mode";
import { Subscriber, SubscriberCountData, SubscriberData } from "src/app/@Models/subscribers.model";
export interface PageState {
    userDetails: {
        users: User[],
        totalRecords: number;
    },
    userTypes: UserType[],
    plans: SubscriptionPlan[];
    questionCredit: QuestionCreditPlan[];
    addSubscription: FAQMainResponse
    subscriberData: Subscriber[];
    loading: boolean;
    error: any;
}

const initialState: PageState = {
    userDetails: { users: [], totalRecords: 0 },
    userTypes: [],
    plans: [],
    questionCredit: [],
    addSubscription: [],
    subscriberData: [],
    loading: false,
    error: null
}

export const pagereducer = createReducer(
    initialState,
    on(loadUserListSuccess, (state, response) => ({
        ...state,
        userDetails: { users: response.data.data, totalRecords: response.data.total }
    })),
    on(loadUserTypesSuccess, (state, response) => ({ ...state, userTypes: response.data })),

    on(loadSubscriptionPlans, (state) => ({ ...state, plans: [] })),
    on(loadSubscriptionPlansSuccess, (state, payload) => ({ ...state, plans: payload.subscriptions.subscriptions })),

    on(loadQuestionCreditPlans, (state) => ({ ...state, plans: [] })),
    on(loadQuestionCreditSuccess, (state, payload) => ({
        ...state,
        questionCredit: payload.subscriptions.questioncredits
    })),
    // subscriber
    on(loadSubscribers, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(loadSubscribersSuccess, (state, { data }) => ({
        ...state,
        subscriberData: data.data,   // store only array from response
        loading: false
    })),
    on(loadSubscribersFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error: error
    })),
    on(clearSubscribers, (state) => ({
        ...state,
        subscriberData: []
    })),


);