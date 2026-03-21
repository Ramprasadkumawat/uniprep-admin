import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {AuthStoreService} from "./service";
import {login, loginFailure, loginSuccess} from "./actions";
import {switchMap, of} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private service: AuthStoreService
    ) {}

    login$ = createEffect(() => this.actions$.pipe(
        ofType(login),
        switchMap((payload) => this.service.login({email: payload.email, password: payload.password}).pipe(
            map(response => loginSuccess(response)),
            catchError(error => of(loginFailure()))
        ))
    ));
}