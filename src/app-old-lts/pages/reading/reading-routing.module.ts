import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReadingComponent} from "./reading.component";

import {SubCategoryComponent} from "./sub-category/sub-category.component";
import {LifeAtCountryComponent} from "./life-at-country/life-at-country.component";
import {TravelAndTourismComponent} from "./travel-and-tourism/travel-and-tourism.component";
import {UniversityComponent} from "./university/university.component";
import {CareerHubComponent} from "./career-hub/career-hub.component";
import {PostAdmissionComponent} from "./post-admission/post-admission.component";
import {PostApplicationComponent} from "./post-application/post-application.component";
import {PreApplicationComponent} from "./pre-application/pre-application.component";
import { SuggestedQuestionComponent } from './suggested-question/suggested-question.component';
import { LearningHubComponent } from './learning-hub/learning-hub.component';
import { LearningSubCategoryComponent } from './learning-sub-category/learning-sub-category.component';
import { LearningHubQuestionsComponent } from './learning-hub-questions/learning-hub-questions.component';
import { SkillMasteryComponent } from './skill-mastery/skill-mastery.component';
import {K12CategoryComponent} from "./k12-category/k12-category.component";
import {K12Component} from "./k12/k12.component";
import {K12ClassComponent} from "./k12-class/k12-class.component";
import {K12SubjectComponent} from "./k12-subject/k12-subject.component";
import {K12ChapterComponent} from "./k12-chapter/k12-chapter.component";
import {K12BoardComponent} from "./k12-board/k12-board.component";
import {K12StateComponent} from "./k12-state/k12-state.component";

const routes: Routes = [
  {
    path: '', component: ReadingComponent,
    children: [
      {
        path: 'sub-category/1', component: SubCategoryComponent,
      },
      {
        path: 'sub-category/2', component: SubCategoryComponent,
      },
      {
        path: 'sub-category/3', component: SubCategoryComponent,
      },
      {
        path: 'sub-category/4', component: SubCategoryComponent,
      },
      {
        path: 'sub-category/5', component: SubCategoryComponent,
      },
      {
        path: 'sub-category/6', component: SubCategoryComponent,
      },
      {
        path: 'sub-category/7', component: SubCategoryComponent,
      },
      {
        path: 'learning-hub/sub-category/:id', component: LearningSubCategoryComponent,
      },
      {
        path: 'pre-application', component: PreApplicationComponent,
      },
      {
        path: 'post-application', component: PostApplicationComponent,
      },
      {
        path: 'post-admission', component: PostAdmissionComponent,
      },
      {
        path: 'career-hub', component: CareerHubComponent,
      },
      {
        path: 'university', component: UniversityComponent,
      },
      {
        path: 'life-at-country', component: LifeAtCountryComponent,
      },
      {
        path: 'travel-and-tourism', component: TravelAndTourismComponent,
      },
      {
        path: 'suggested-question', component: SuggestedQuestionComponent,
      },
      {
        path: 'learning-hub', component: LearningHubComponent,
      },
      {
        path: 'k12-board', component: K12BoardComponent,
      },
      // {
      //   path: 'k12-class', component: K12ClassComponent,
      // },
      {
        path: 'k12-class/:board_id', component: K12ClassComponent,
      },
      {
        path: 'k12-subject/:board_id/:class_id', component: K12SubjectComponent,
      },
      {
        path: 'k12', component: K12CategoryComponent,
      },
      {
        path: 'k12/:id', component: K12CategoryComponent,
      },
      {
        path: 'k12/:id/:subId', component: K12CategoryComponent,
      },
      {
        path: 'k12-chapter/:subject_id', component: K12ChapterComponent,
      },
      {
        path: 'k12-state/:board_id', component: K12StateComponent,
      },
      {
        path: 'k12-question', component: K12Component,
      },
      {
        path: 'learning-hub-questions', component: LearningHubQuestionsComponent,
      },
      { path: '', redirectTo: 'sub-category/1', pathMatch: 'full' },
      {
        path: 'sub-category/10', component: SubCategoryComponent,
      },
      {
        path: 'skill-mastery', component: SkillMasteryComponent,
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReadingRoutingModule { }
