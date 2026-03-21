import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Params, Router} from "@angular/router";
import { ReviewsubmoduleService } from './reviewsubmodule.service';

@Component({
    selector: 'uni-reviewsubmodule',
    imports: [CommonModule],
    templateUrl: './reviewsubmodule.component.html',
    styleUrls: ['./reviewsubmodule.component.scss']
})
export class ReviewsubmoduleComponent implements OnInit {
  module: any;
  subModules: any;
  subempty:boolean = false;
  subnotempty:boolean = false;
  submoduleCount:number;
  modulename:string;
  // route: any;
  // module: any;

  constructor(private router: Router,private route: ActivatedRoute, private service: ReviewsubmoduleService) {
    // 
   }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.module = this.route.snapshot.paramMap.get("id");
      // alert(localStorage.getItem('headCountry'));
      let data = {
        countryId:localStorage.getItem('headCountry'),
        moduleId:this.module
      }
      this.getSubModules(data);
    });
  }


  getSubModules(data){
    this.service.GetSubModules(data).subscribe((response) => {
      if(response.empty == true){
        this.subempty = true
        this.subnotempty = false
        this.submoduleCount = response.submodulecount
        this.modulename = response.module_name
      }else{
        this.subModules = response.data;
        this.subnotempty = true
        this.subempty = false
        this.submoduleCount = response.submodulecount;
        this.modulename = response.module_name
      }
 
    })
  }

  questionspage(submodule){

    this.router.navigate(['/review/questions/',this.module,submodule]);
  }
}
