import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CompanyListComponent} from "./company-list.component";

const routes: Routes = [
  {
    path: '', component: CompanyListComponent,
    children: [
      {
        path: 'list', component: CompanyListComponent,
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyListRoutingModule { }
