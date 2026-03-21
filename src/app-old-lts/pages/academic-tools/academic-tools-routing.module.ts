import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcademicToolsComponent } from './academic-tools.component';
import { AcademicToolsCategoryComponent } from './academic-tools-category/academic-tools-category.component';
import { AcademicToolsQuizComponent } from './academic-tools-quiz/academic-tools-quiz.component';
import { AcademictToolsListComponent } from './academict-tools-list/academict-tools-list.component';

const routes: Routes = [
  {
    path: '', component: AcademicToolsComponent,
    children: [
      {
        path: '', component: AcademictToolsListComponent
      },
      {
        path: ':id', component: AcademicToolsCategoryComponent
      },
      {
        path: ':id/quiz/:subModuleId', component: AcademicToolsQuizComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcademicToolsRoutingModule { }
