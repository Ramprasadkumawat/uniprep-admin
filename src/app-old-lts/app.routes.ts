// app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './Auth/auth.guard';
import { environment } from '../environments/environment';
import { MaintenanceComponent } from './maintenance/maintenance.component';

export const routes: Routes = environment.maintenanceMode
  ? [
      {
        path: '**',
        component: MaintenanceComponent
      }
    ]
  : [
      {
        path: '',
        loadChildren: () =>
          import('./pages/pages.module').then(m => m.PagesModule),
        canActivate: [AuthGuard],
        // Uncomment if you want the resolver
        // resolve: { user: UserResolver }
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./Auth/auth.module').then(m => m.AuthModule)
      }
    ];
