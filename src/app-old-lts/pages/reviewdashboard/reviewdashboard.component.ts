import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewdashboadService } from './reviewdashboad.service';

@Component({
    selector: 'uni-reviewdashboard',
    imports: [CommonModule],
    templateUrl: './reviewdashboard.component.html',
    styleUrls: ['./reviewdashboard.component.scss']
})
export class ReviewdashboardComponent implements OnInit {
  dashdata: any;

  constructor(private service: ReviewdashboadService) { }

  ngOnInit(): void {

    this.service.GetDashData().subscribe((res) => {
      this.dashdata = res;
    }); 
  }

}
