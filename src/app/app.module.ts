import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AuthService } from './Auth/auth.service';
import { EffectsModule } from '@ngrx/effects';
import { HttpErrorInterceptor } from "./interceptors/http-error.interceptor";
import { NGX_LOCAL_STORAGE_CONFIG, NgxLocalstorageConfiguration } from "ngx-localstorage";
import { JwtModule } from "@auth0/angular-jwt";
import { AuthModule } from './Auth/auth.module';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { providePrimeNG } from 'primeng/config';
import MyPreset from "./mypreset"
import { AddCountryInsightsQuestionsComponent } from './pages/founderstool/country-insights/add-country-insights-questions/add-country-insights-questions.component';
import { BlukUploadComponent } from './@shared/components/bluk-upload/bulk-upload.component';
import { NgxUiLoaderModule, NgxUiLoaderConfig } from 'ngx-ui-loader';
import { ToastModule } from 'primeng/toast';

const reducers = {};

const ngxLocalstorageConfiguration: NgxLocalstorageConfiguration = {
  delimiter: '@',
  prefix: 'sop-admin@'
};

export function tokenGetter() {
  return localStorage.getItem(
    `${ngxLocalstorageConfiguration.prefix}${ngxLocalstorageConfiguration.delimiter}${environment.tokenKey}`
  )?.replace(/"/g, '') || '';
}

@NgModule({
  declarations: [
    MaintenanceComponent,
  ],
  imports: [
    BrowserModule,
    ToastModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    PagesModule,
    StoreModule.forRoot(reducers, {}),
    // AuthModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([]),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [environment.domain],
        disallowedRoutes: [],
      },
    }),
    NgxUiLoaderModule
  ],
  providers: [
    DatePipe,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: NGX_LOCAL_STORAGE_CONFIG,
      useValue: ngxLocalstorageConfiguration
    },
    provideHttpClient(withInterceptorsFromDi()),

    // New PrimeNG global config
    providePrimeNG({
      theme: {
        preset: MyPreset, // or Saga, Lara, etc.
        options: {
          prefix: 'p', // default
        }
      }
    })
  ]
})
export class AppModule { }
