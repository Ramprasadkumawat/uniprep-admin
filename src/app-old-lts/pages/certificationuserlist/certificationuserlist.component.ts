import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'angular-highcharts';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import {SelectModule} from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { AuthService } from 'src/app/Auth/auth.service';
import { GenralreportService } from '../genralreport/genralreport.service';
import { ActivatedRoute } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
@Component({
    selector: 'uni-certificationuserlist',
    templateUrl: './certificationuserlist.component.html',
    styleUrls: ['./certificationuserlist.component.scss'],
    imports: [CommonModule, AccordionModule, InputTextModule, MultiSelectModule, TableModule, ButtonModule, SelectModule, ReactiveFormsModule, ChartModule, PaginatorModule]
})
export class CertificationuserlistComponent implements OnInit {
  moduleid: string;
  certificatesamplelist:any[]=[];
  certificatesample:any[]=[];
  paginationcount=0;
  pageno:number = 1;
  perPage:number = 10;
  filterForm: FormGroup;
  intcountries: any = [];
  studentlistdrop:any=[];
  constructor(private route: ActivatedRoute,private authservice: AuthService,private genralreport: GenralreportService,
    private toastr: MessageService,private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      country: [''],
      studentname:[''],
      createdFrom:[''],
      createdTo:[''],
      module:['']
    });
   }

  ngOnInit(): void {
    this.moduleid = this.route.snapshot.paramMap.get('moduleid')
    this.getcertificateModuleUserList()
    this.getcertificateModuleList(); 
    this.getCountriesList();
    this.getStudentsList();
  }
  getcertificateModuleList(){
    this.certificatesamplelist=[];
    this.genralreport.getDummyCertificateList().subscribe(response => {
     this.certificatesample=response
    });
  }
  getcertificateModuleUserList(){
    this.certificatesamplelist=[];
    var data={
      user_id:this.filterForm.value.studentname,
      module_id:this.moduleid,
      country:this.filterForm.value.country,
      perpage : this.perPage,
      page : this.pageno,
      valid_fromdate:this.filterForm.value.createdFrom,
      valid_todate:this.filterForm.value.createdTo,
    }
    this.genralreport.getCertificateUserList(data).subscribe(response => {
     this.certificatesamplelist=response.details;
     this.paginationcount=response.count;
    });
  }
  downloadSampleCertificate(certificatelink){
    window.open(certificatelink, '_blank');
  }
  pageChange(event: any) {
    this.pageno = (event.page ?? 0) + 1; 
    this.perPage = event.rows ?? 10;
    let data = {
      user_id:this.filterForm.value.studentname,
      perpage : this.perPage,
      country:this.filterForm.value.country,
      page : event.page + 1,
      module_id:this.moduleid,
      valid_fromdate:this.filterForm.value.createdFrom,
      valid_todate:this.filterForm.value.createdTo,
    }
    this.genralreport.getCertificateUserList(data).subscribe(response => {
      this.certificatesamplelist=response.details;
      this.paginationcount=response.count;
     });
  }
  filterData(){
    const formData = this.filterForm.value;
    if (!formData.country && !formData.status && !formData.createdTo && !formData.createdFrom  && !formData.studentname) {
      this.toastr.add({ severity: 'error', summary: 'Error', detail: 'Please make sure you have some filter!' });
      return;
    }
    this.getcertificateModuleList()
  }
  filterFormReset(){
    this.filterForm.reset();
    this.getcertificateModuleList()
  }
  getCountriesList() {
    this.intcountries=[];
    this.genralreport.getCountriesList().subscribe((response) => {
      response.forEach((element: any) => {
        var bindingdata = {
          id: element.id,
          name: element.country
        };
        this.intcountries.push(bindingdata);
      });
    });
  }
  getStudentsList() {
    this.studentlistdrop=[];
    var data={
      module_id:this.moduleid
    }
    this.genralreport.getStudentsList(data).subscribe((response) => {
      response.forEach((element: any) => {
        var bindingdata = {
          id: element.user_id,
          name: element.name
        };
        this.studentlistdrop.push(bindingdata);
      });
    });
  }
}
