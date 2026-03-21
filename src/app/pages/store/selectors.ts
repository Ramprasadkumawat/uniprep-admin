import { PageState } from "./reducer";
import { createFeatureSelector, createSelector } from "@ngrx/store";

export const pagesFeatureKey = 'pagesFeatureKey';

const featureSelect = createFeatureSelector<PageState>(pagesFeatureKey);

export const selectUserPageData$ = createSelector(featureSelect, (state: PageState) => state.userDetails);
export const selectUserTypes$ = createSelector(featureSelect, (state: PageState) => state.userTypes);
export const selectPlans$ = createSelector(featureSelect, (state) => state.plans);
export const selectLoading$ = createSelector(featureSelect, (state) => state.loading);

export const selectQuestionCreditPlans$ = createSelector(featureSelect, (state) => state.questionCredit);
// subscrib data
export const selectSubscribers$ = createSelector(
    featureSelect,
    (state: PageState) => state.subscriberData        // returns Subscriber[]
);
