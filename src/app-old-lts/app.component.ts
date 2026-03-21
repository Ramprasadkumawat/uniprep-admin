import { Component } from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import { ToastModule } from 'primeng/toast';
import { NgxUiLoaderModule, NgxUiLoaderConfig } from 'ngx-ui-loader';

@Component({
    selector: 'app-root',
    template: `
    <router-outlet></router-outlet>
    <p-toast position="top-right"></p-toast>
    <ngx-ui-loader [bgsOpacity]=".1" fgsType="ball-spin-clockwise" fgsColor="var(--p-primary-500)" [hasProgressBar]="false"></ngx-ui-loader>`,
    standalone: true,
    imports: [NgxUiLoaderModule, ToastModule, RouterModule],
})
export class AppComponent {
}
