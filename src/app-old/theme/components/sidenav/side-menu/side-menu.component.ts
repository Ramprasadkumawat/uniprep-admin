import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SideMenu } from '../sidenav.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
    selector: 'uni-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('accordion', [
            transition(':enter', [
                style({ height: 0 }),
                animate('100ms', style({ "height": '*' })),
            ]),
            transition(':leave', [
                animate('100ms', style({ "height": 0 }))
            ])
        ]),
    ],
    standalone: false
})
export class SideMenuComponent implements OnInit {

  @Input() menus: SideMenu[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
    )
    .subscribe({
      next: () => {
        this.markCurrentMenu();
      }
    });
  }

  ngOnInit(): void {
    this.markCurrentMenu();
  }

  markCurrentMenu() {
    const path = this.router.url.split('?')[0];
    const paramtersLen = Object.keys(this.activatedRoute.snapshot.params).length;
    const pathArr = path.split('/').slice(0, path.split('/').length - paramtersLen);
    const url = pathArr.join('/');
    this.menus.forEach(menu => {
      if (menu.url == url) {
        menu.active = true;
      } else {
        if (menu.children && menu.children?.length > 0) {
          menu.children.forEach(cmenu => {
            if (cmenu.url == url) {
              cmenu.active = true;
              menu.active = true;
            } else {
              cmenu.active = false;
              menu.active = false;
            }
          });
        } else {
          menu.active = false;
        }
      }
    });
  }

  onexpand(item: SideMenu) {
    
    if (item.header) {
      return;
    }
    if (item.expanded) {
      item.expanded = !item.expanded;
      return;
    }
    if (item.children) {
      if (item.children.length > 0) {
        item.expanded = true;
      } else {
        item.expanded = false;
      }
    } else {
      this.router.navigateByUrl(item.url);
    }
  }
}
