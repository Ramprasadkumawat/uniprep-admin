import { Component, HostListener, OnDestroy, OnInit, Output } from "@angular/core";
import { PageFacadeService } from "./page-facade.service";
import { SubSink } from "subsink";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../Auth/auth.service";
import { Observable } from "rxjs";

@Component({
    selector: "uni-pages",
    templateUrl: "./pages.component.html",
    styleUrls: ["./pages.component.scss"],
    standalone: false
})
export class PagesComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  sidebarClass = "";
  stickHeader = false;
  constructor(
    private pageFacade: PageFacadeService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.authService.getMe().subscribe();
  }

  onWindowScroll(event: any) {
    if (event.srcElement.scrollTop < 70) {
      this.stickHeader = false;
    } else {
      this.stickHeader = true;
    }
  }
  @Output() expandicon = !this.sidebarClass
    ? "pi-align-right"
    : "pi-align-justify";

  logout() {
    this.authService.logout();
  }
}
