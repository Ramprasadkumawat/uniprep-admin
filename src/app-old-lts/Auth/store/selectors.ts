import {createFeatureSelector, createSelector} from "@ngrx/store";
import {AuthState} from "./reducer";

export const authFeatureKey = 'authFeatureKey';

const featureSelect = createFeatureSelector<AuthState>(authFeatureKey);

export const selectLoading$ = createSelector(featureSelect, (state: AuthState) => state.loading);
export const selectMessage$ = createSelector(featureSelect, (state: AuthState) => state.message);
export const selectloggedIn$ = createSelector(featureSelect, (state: AuthState) => state.loggedIn);