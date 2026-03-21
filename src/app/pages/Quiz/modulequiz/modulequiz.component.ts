import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'uni-modulequiz',
    templateUrl: './modulequiz.component.html',
    styleUrls: ['./modulequiz.component.scss'],
    standalone: false
})
export class ModulequizComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  preAdmission(){
    this.router.navigate(["/quiz/pre-application"]);
  }
  postadmission(){
    this.router.navigate(["/quiz/post-admission"]);
  }
  lifefeat(){
    this.router.navigate(["/quiz/life-at"]);
  }
  careerhub(){
    this.router.navigate(["/quiz/career-hub"]);
  }
}
