import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, switchMap } from "rxjs";
import { catchError, filter, map, withLatestFrom } from "rxjs/operators";
import { Service } from "./service";
import {
    createUser, loadUserList, loadUserListSuccess, loadUserTypes, loadUserTypesSuccess,
    loadSubscriptionPlans, loadSubscriptionPlansSuccess, loadQuestionCreditPlans, loadQuestionCreditSuccess,
    loadSubscribers,
    loadSubscribersFailure,
    loadSubscribersSuccess,
} from "./actions";
import { Injectable } from "@angular/core";
import { SubscriberService } from "../subscribers/subscriber.service";
import { selectSubscribers$ } from "./selectors";
import { Store } from "@ngrx/store";

@Injectable({ providedIn: 'root' })
export class PageEffects {
    constructor(
        private actions$: Actions,
        private service: Service,
        private subscribeService: SubscriberService,
        private store: Store
    ) { }

    loadUserData$ = createEffect(() => this.actions$.pipe(
        ofType(loadUserList),
        switchMap((params) => this.service.loadUsers(params.data).pipe(
            map(response => loadUserListSuccess({ data: response }))
        ))
    ));
    loadUserTypes$ = createEffect(() => this.actions$.pipe(
        ofType(loadUserTypes),
        switchMap(() => this.service.loadUserTypes().pipe(
            map(response => loadUserTypesSuccess({ data: response }))
        ))
    ));

    createUser$ = createEffect(() => this.actions$.pipe(
        ofType(createUser),
        switchMap((payload) => this.service.createUser(payload.data).pipe(
            map(response => loadUserList({ data: { page: 1 } }))
        ))
    ));

    subscriptionList$ = createEffect(() => this.actions$.pipe(
        ofType(loadSubscriptionPlans),
        switchMap((payload) => this.service.getSubscriptionList().pipe(
            map(response => loadSubscriptionPlansSuccess({ subscriptions: response }))
        ))
    ));

    questionCreditList$ = createEffect(() => this.actions$.pipe(
        ofType(loadQuestionCreditPlans),
        switchMap((payload) => this.service.getQuestionCreditList().pipe(
            map(response => loadQuestionCreditSuccess({ subscriptions: response }))
        ))
    ))

    addSubscription$ = createEffect(() => this.actions$.pipe(
        ofType(createUser),
        switchMap((payload) => this.service.addFaqQuestion(payload.data).pipe(
            map(response => loadUserList({ data: { page: 1 } }))
        ))
    ));
    /* -------------------- ✅ Subscribers Effect -------------------- */
    // ✅ Subscribers Effect with condition
    loadSubscribers$ = createEffect(() => this.actions$.pipe(
        ofType(loadSubscribers),
        withLatestFrom(this.store.select(selectSubscribers$)),  // combine with current store data
        filter(([action, subscribers]) => !subscribers || subscribers.length === 0), // only call API if empty
        switchMap(([action]) =>
            this.subscribeService.getSubscribers(action.params).pipe(
                map(response => loadSubscribersSuccess({ data: response })),
                catchError(error => of(loadSubscribersFailure({ error })))
            )
        )
    ));
}

