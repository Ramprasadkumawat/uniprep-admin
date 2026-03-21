import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from './quiz.component';
import { PreApplicationComponent } from './pre-application/pre-application.component';
import { PostApplicationComponent } from './post-application/post-application.component';
import {PostAdmissionComponent} from "./post-admission/post-admission.component";
import {CareerHubComponent} from "./career-hub/career-hub.component";
import {UniversityComponent} from "./university/university.component";
import {LifeAtComponent} from "./life-at/life-at.component";
import { ModulequizComponent } from './modulequiz/modulequiz.component';
import { UniversitylistcountrywiseComponent } from './universitylistcountrywise/universitylistcountrywise.component';
import { LearninghublistComponent } from './learninghublist/learninghublist.component';
import { LearningHubQuizQuestionsComponent } from './learning-hub/learning-hub.component';
import { LanguagehblistComponent } from './languagehblist/languagehblist.component';
import { LanguagequizlistComponent } from './languagequizlist/languagequizlist.component';
import { SkillMasteryComponent } from './skill-mastery/skill-mastery.component';
import { PsychometricTestComponent } from './psychometric-test/psychometric-test.component';
import { PersonalityTestComponent } from './personality-test/personality-test.component';
import { EmployerTestComponent } from './employer-test/employer-test.component';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { TestSubCategoryListComponent } from './test-sub-category-list/test-sub-category-list.component';
import { QuizQuestionListComponent } from './quiz-question-list/quiz-question-list.component';
import {K12SubjectComponent} from "./k12-subject/k12-subject.component";
import {K12ClassComponent} from "./k12-class/k12-class.component";

const routes: Routes = [
  {
    path: '', component: QuizComponent,
    children: [
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
        path: 'life-at', component: LifeAtComponent,
      },
      {
        path: 'quizmodule', component: ModulequizComponent,
      },
      {
        path: 'unversitylist', component: UniversitylistcountrywiseComponent,
      },
      {
        path: 'k12-class', component: K12ClassComponent,
      },
      {
        path: 'k12-subject', component: K12SubjectComponent,
      },
      {
        path: 'learninghublist', component: LearninghublistComponent,
      },
      {
        path: 'learning-hub/:id', component: LearningHubQuizQuestionsComponent,
      },
      { path: '', redirectTo: 'pre-application', pathMatch: 'full' },
      {
        path: 'languagehublist', component: LanguagehblistComponent,
      },
      {
        path: 'language-hub/:id1/:1d2', component: LanguagequizlistComponent,
      },
      {
        path: 'skill-mastery', component: SkillMasteryComponent,
      },
      {
        path: 'psychometric-test', component: PsychometricTestComponent,
      },
      {
        path: 'personality-test', component: PersonalityTestComponent,
      },
      {
        path: 'employer-test', component: EmployerTestComponent,
      },
      {
        path: ':moduleName/:categoryId/sub-category', component: TestSubCategoryListComponent,
      },
      {
        path: ':moduleName/:categoryId/list', component: QuizListComponent,
      },
      {
        path: ':moduleName/:categoryId/questions/:quizModuleId', component: QuizQuestionListComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizRoutingModule { }
