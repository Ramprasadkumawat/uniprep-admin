import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuizRoutingModule } from './quiz-routing.module';
import { QuizComponent } from './quiz.component';
import { InputTextModule } from 'primeng/inputtext';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import {SelectModule} from 'primeng/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TextareaModule} from 'primeng/textarea';
import { PreApplicationComponent } from './pre-application/pre-application.component';
import { PostApplicationComponent } from './post-application/post-application.component';
import { PostAdmissionComponent } from './post-admission/post-admission.component';
import { CareerHubComponent } from './career-hub/career-hub.component';
import { LifeAtComponent } from './life-at/life-at.component';
import { UniversityComponent } from './university/university.component';
import { PaginatorModule } from 'primeng/paginator';
import { ModulequizComponent } from './modulequiz/modulequiz.component';
import { UniversitylistcountrywiseComponent } from './universitylistcountrywise/universitylistcountrywise.component';
import { LearninghublistComponent } from './learninghublist/learninghublist.component';
import { ButtonModule } from 'primeng/button';
import { LearningHubQuizQuestionsComponent } from './learning-hub/learning-hub.component';
import { LanguagehblistComponent } from './languagehblist/languagehblist.component';
import { LanguagequizlistComponent } from './languagequizlist/languagequizlist.component';
import { CapitalizeFirstDirective } from './capitalize-first.directive';
import { SkillMasteryComponent } from './skill-mastery/skill-mastery.component';
import { PsychometricTestComponent } from './psychometric-test/psychometric-test.component';
import { EmployerTestComponent } from './employer-test/employer-test.component';
import { PersonalityTestComponent } from './personality-test/personality-test.component';
import { TestCategoryListComponent } from './test-category-list/test-category-list.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { TestSubCategoryListComponent } from './test-sub-category-list/test-sub-category-list.component';
import { QuizQuestionListComponent } from './quiz-question-list/quiz-question-list.component';
import { K12ClassComponent } from './k12-class/k12-class.component';
import { K12SubjectComponent } from './k12-subject/k12-subject.component';
 
@NgModule({
    declarations: [
        QuizComponent,
        PreApplicationComponent,
        PostApplicationComponent,
        PostAdmissionComponent,
        CareerHubComponent,
        LifeAtComponent,
        UniversityComponent,
        ModulequizComponent,
        UniversitylistcountrywiseComponent,
        LearninghublistComponent,
        LearningHubQuizQuestionsComponent,
        LanguagehblistComponent,
        LanguagequizlistComponent,
        CapitalizeFirstDirective,
        SkillMasteryComponent,
        PsychometricTestComponent,
        EmployerTestComponent,
        PersonalityTestComponent,
        TestCategoryListComponent,
        QuizListComponent,
        TestSubCategoryListComponent,
        QuizQuestionListComponent,
        K12ClassComponent,
        K12SubjectComponent,
    ],
    imports: [
        CommonModule, QuizRoutingModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
        TextareaModule, ReactiveFormsModule, FormsModule, PaginatorModule, ButtonModule,ConfirmPopupModule 
    ],
    exports: [CapitalizeFirstDirective],
    providers: [ConfirmationService]
})
export class QuizModule {
}
