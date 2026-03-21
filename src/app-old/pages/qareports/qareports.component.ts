import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QareportsService } from "src/app/pages/qareports/qareports.service";

@Component({
    selector: 'uni-qareports',
    imports: [CommonModule],
    templateUrl: './qareports.component.html',
    styleUrls: ['./qareports.component.scss']
})
export class QareportsComponent implements OnInit {
  qareportdata: any;

  constructor(private service: QareportsService) { }

  ngOnInit(): void {
    this.getUsersDaily();
  }

  

  getUsersDaily(){
    let data;
    this.service.qareportlist(data).subscribe((Response) => {
      this.qareportdata = Response;
    })
  }

  showComment(reportid: string){
    alert(reportid);
    document.getElementById(reportid).style.display = "table-row";
    // ele.style.display = "none";
  }




}
