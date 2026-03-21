import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './Auth/auth.service';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { NGX_LOCAL_STORAGE_CONFIG, NgxLocalstorageConfiguration } from 'ngx-localstorage';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ToastModule } from 'primeng/toast';
import { providePrimeNG } from 'primeng/config';
import MyPreset from './mypreset';
import { environment } from '@env/environment';
import { AuthGuard } from './Auth/auth.guard';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { PagesModule } from './pages/pages.module';
import { MessageService } from 'primeng/api';

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

const routes = environment.maintenanceMode
  ? [{ path: '**', component: MaintenanceComponent }]
  : [
      {
        path: '',
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'auth',
        loadChildren: () => import('./Auth/auth.module').then(m => m.AuthModule)
      }
    ];

    export const appConfig: ApplicationConfig = {
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter(routes, withEnabledBlockingInitialNavigation()),
        provideAnimations(),
        DatePipe,
        AuthService,
        MessageService, // <-- add this here, not inside importProvidersFrom
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpErrorInterceptor,
          multi: true
        },
        {
          provide: NGX_LOCAL_STORAGE_CONFIG,
          useValue: ngxLocalstorageConfiguration
        },
        providePrimeNG({
          theme: {
            preset: MyPreset,
            options: {
              darkModeSelector: ".app-dark",
            },
          },
        }),
        importProvidersFrom(
          ToastModule,
          PagesModule,
          StoreModule.forRoot(reducers, {}),
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
        )
      ]
    };
    