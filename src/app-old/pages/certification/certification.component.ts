import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'angular-highcharts';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import {SelectModule} from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { AuthService } from 'src/app/Auth/auth.service';
import { GenralreportService } from '../genralreport/genralreport.service';
import { Router } from '@angular/router';

@Component({
    selector: 'uni-certification',
    templateUrl: './certification.component.html',
    styleUrls: ['./certification.component.scss'],
    imports: [CommonModule, AccordionModule, InputTextModule, TableModule, ButtonModule, SelectModule, ReactiveFormsModule, ChartModule]
})
export class CertificationComponent implements OnInit {
  loginname=""
  certificatesamplelist:any[]=[]
  constructor(private authservice: AuthService,private genralreport: GenralreportService, private router:Router) { }

  ngOnInit(): void {
    this.authservice.userData.subscribe((data) => {
      this.loginname = data[0].name
    })
    this.getcertificateModuleList();
  }
  downloadSampleCertificate(list:any){
    var data={
      name:list.name,
      country:list.country_id,
      module:list.module_id,
      submodule:list.submodule_id,
      certificateid:list.certificateId,
      validtill:list.validTill
    }
    this.genralreport.downloadSampleCertificate(data).subscribe(response => {
      window.open(response.certificate, '_blank');
    });
  }
  getcertificateModuleList(){
    this.certificatesamplelist=[];
    this.genralreport.getDummyCertificateList().subscribe(response => {
     this.certificatesamplelist=response
    });
  }
  certificateUserList(id:any){
    this.router.navigate([`/certificationuserlist`, id]);
  }
}
