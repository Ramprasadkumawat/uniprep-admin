import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SuggestedAddQuestionComponent} from "./suggested-add-question.component";

const routes: Routes = [  {
  path: '', component: SuggestedAddQuestionComponent,
  children: [
    {
      path: 'question-request', component: SuggestedAddQuestionComponent,
    },
    { path: '', redirectTo: 'question-request', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuggestedAddQuestionRoutingModule { }
