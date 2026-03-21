import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReadingComponent} from "../reading/reading.component";
import {SubCategoryComponent} from "../reading/sub-category/sub-category.component";
import {PreApplicationComponent} from "../reading/pre-application/pre-application.component";
import {PostApplicationComponent} from "../reading/post-application/post-application.component";
import {PostAdmissionComponent} from "../reading/post-admission/post-admission.component";
import {CareerHubComponent} from "../reading/career-hub/career-hub.component";
import {UniversityComponent} from "../reading/university/university.component";
import {LifeAtCountryComponent} from "../reading/life-at-country/life-at-country.component";
import {SuggestedQuestionComponent} from "../reading/suggested-question/suggested-question.component";
import {InvestorComponent} from "./investor.component";
import {CompanyListComponent} from "../company-list/company-list.component";

const routes: Routes = [
  {
    path: '', component: InvestorComponent,
    children: [
      {
        path: 'list', component: InvestorComponent,
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestorRoutingModule { }
