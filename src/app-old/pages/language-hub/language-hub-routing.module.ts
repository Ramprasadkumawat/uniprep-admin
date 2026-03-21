import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LanguageHubComponent } from './language-hub/language-hub.component';
import { LanguageHubSubcategoryComponent } from './language-hub-subcategory/language-hub-subcategory.component';
import { LanguageHubQuestionsComponent } from './language-hub-questions/language-hub-questions.component';
import { LanguageHubSubmoduleComponent } from './language-hub-submodule/language-hub-submodule.component';
import { LanguageComponent } from './language/language.component';
import {PvlComponent} from "./pvl/pvl.component";

const routes: Routes = [
  {path: '', component: LanguageComponent,
  children:[
    {
      path:'category',component:LanguageHubComponent
    },
    {
      path:'pvl',component:PvlComponent
    },
  {
    path: 'sub-type', component: LanguageHubSubcategoryComponent,
  },
  {
    path: 'questions', component: LanguageHubQuestionsComponent,
  },
  {
    path: 'sub-module', component: LanguageHubSubmoduleComponent,
  }]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LanguageHubRoutingModule { }
