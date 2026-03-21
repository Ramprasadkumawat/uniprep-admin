import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../quiz.service';
import { FormBuilder } from '@angular/forms';
import { LocationService } from 'src/app/location.service';

@Component({
    selector: 'uni-universitylistcountrywise',
    templateUrl: './universitylistcountrywise.component.html',
    styleUrls: ['./universitylistcountrywise.component.scss'],
    standalone: false
})
export class UniversitylistcountrywiseComponent implements OnInit {
  selectedCountry:any = 2;
  countryList: any;
  getUniversty:any[]=[]
  universitylenght:number=0
  constructor(private router:Router,private quizService: QuizService, private fb: FormBuilder,private service: LocationService,) { }

  ngOnInit(): void {
    this.getCountryList();
  }
  preAdmission(id:any){
    let universityid = id
    localStorage.setItem('coutryidforquizunversity', this.selectedCountry);
    localStorage.setItem('unversityidforquizunversity', universityid);
    this.router.navigate(["/quiz/university"]);
  }
  getUnversityCountry(){
   var data={
    country_id:this.selectedCountry
   }
   this.quizService.getPreUniversityCountrywiseList(data).subscribe((res:any)=>{
    this.getUniversty=res
    this.universitylenght=res.length
    console.log(res);
   })
    }
  countryOnChange(event: any) {
    this.selectedCountry = event.value;
    this.getUnversityCountry();
  }
  getCountryList() {
    this.service.getInterestedCountryList().subscribe(data => {
      this.countryList = data;
      this.selectedCountry=2
      this.getUnversityCountry();
    })
  }

}
