import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {SopComponent} from "../pages/sop/sop.component";
import {SopService} from "../pages/sop/sop.service";

@Injectable({
  providedIn: 'root'
})
export class SopCanDeactivateGuard implements CanDeactivate<SopComponent> {
  constructor(
      private sopService: SopService
  ) {}

  canDeactivate(component: SopComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return component.canDeactivate()  || Observable.create((observer: any) => {
      component.confirmationService.confirm({
        header: 'Confirm!',
        message: `Press NO to go back and save these changes, or YES to lose these changes.`,
        icon: 'fa fa-exclamation-triangle',
        acceptLabel: 'YES', rejectLabel: 'NO',
        reject: () => { observer.next(false);  observer.complete(); },
        accept: () => { this.sopService.resetSOP(); observer.next(true);  observer.complete(); }
      })

    })
  }
}
