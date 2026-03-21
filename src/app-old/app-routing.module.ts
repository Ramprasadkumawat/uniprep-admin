import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "./Auth/auth.guard";
import {UserResolver} from "./resolvers/user.resolver";
import {environment} from "@env/environment";
import {MaintenanceComponent} from "./maintenance/maintenance.component";

const routes: Routes = []
if (environment.maintenanceMode) {
  routes.push({path: '**', component: MaintenanceComponent});
} else {
  routes.push(
      {
        path: "",
        loadChildren: () => import("./pages/pages.module").then((m) => m.PagesModule),
        canActivate: [AuthGuard],
        // resolve: {
        //   user: UserResolver
        // }
      },
      {
        path: "auth",
        loadChildren: () =>
            import("./Auth/auth.module").then((m) => m.AuthModule),
      });
}


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
