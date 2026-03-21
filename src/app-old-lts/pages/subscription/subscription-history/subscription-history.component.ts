import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../subscription.service';
import { SubscriptionPlan } from 'src/app/@Models/subscription';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';

@Component({
    selector: 'uni-subscription-history',
    imports: [CommonModule, TableModule],
    templateUrl: './subscription-history.component.html',
    styleUrls: ['./subscription-history.component.scss']
})
export class SubsriptionHistoryComponent implements OnInit {

  pageSize: number = 10;
  page: number = 1;
  subscriptionList: any = [];
  subscriptionCount: number = 0;

  constructor(private subscriptionService: SubscriptionService, private router: Router) { }

  ngOnInit(): void {
    this.loadSubscriptionList()
  }

  loadSubscriptionList() {
    let data = {
      page: this.page,
      perpage: this.pageSize
    }
    this.getSubscriptionList(data);
  }

  getSubscriptionList(data: any) {
    this.subscriptionService.getSubscriptionHistory(data).subscribe((response) => {
      this.subscriptionList = response.subscriptions.map((sub: SubscriptionPlan) => ({ ...sub, validityDays: this.getDiffernceOfTwoDates(sub.validityFrom, sub.validityTo) }))
      this.subscriptionCount = response.count;
    });
  }

  getDiffernceOfTwoDates(fromDate: string, toDate: string) {
    const date1: any = new Date(fromDate);
    const date2: any = new Date(toDate);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  pageChange(event: any) {
    const page = event.first / this.pageSize + 1;
    let data = {
      page: page,
      perpage: this.pageSize
    }
    this.getSubscriptionList(data);
  }

  navigateSubscription() {
    this.router.navigate(['subscription'])
  }
}
