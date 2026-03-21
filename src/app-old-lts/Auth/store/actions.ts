import {createAction} from "@ngrx/store";
import {LoginRequest, LoginResponse} from "../../@Models/auth.model";

export const login = createAction('[AUTH] login', (payload: LoginRequest) => payload);
export const loginSuccess = createAction('[AUTH] login success', (payload: LoginResponse) => payload);
export const loginFailure = createAction('[AUTH] login failure');
export const resetLogin = createAction('[AUTH] login reset');