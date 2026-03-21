import {createReducer, on} from "@ngrx/store";
import {login, loginFailure, loginSuccess, resetLogin} from "./actions";

export interface AuthState {
    loading: boolean;
    message: string;
    loggedIn: boolean;
}

export const initialState: AuthState = {
    loading: false,
    message: '',
    loggedIn: false
}

export const authReducer = createReducer(
    initialState,
    on(login, (state: AuthState) => ({...state, loading: true, message: '', loggedIn: false})),
    on(loginSuccess, (state: AuthState, payload) => ({...state, loading: false, message: 'Login Success', loggedIn: true})),
    on(loginFailure, (state: AuthState) => ({...state, loading: false, message: '', loggedIn: false})),
    on(resetLogin, (state: AuthState) => ({...state, loading: false, message: '', loggedIn: false}))
);