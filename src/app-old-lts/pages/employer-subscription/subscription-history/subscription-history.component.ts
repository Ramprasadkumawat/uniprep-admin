import { Component } from '@angular/core';
import { EmployerSubscriptionService } from '../employer-subscription.service';
import { Router } from '@angular/router';
import { SubscriptionPlan } from 'src/app/@Models/subscription';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'uni-subscription-history',
  standalone:true,
  imports: [TableModule,CommonModule],
  templateUrl: './subscription-history.component.html',
  styleUrl: './subscription-history.component.scss'
})
export class SubscriptionHistoryComponent {
 pageSize: number = 10;
  page: number = 1;
  subscriptionList: any = [];
  subscriptionCount: number = 0;

  constructor(private subscriptionService: EmployerSubscriptionService, private router: Router) { }

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
    this.subscriptionService.getEmployerSubscriptions(data).subscribe((response) => {
      this.subscriptionList = response.subscriptionhistories.map((sub: SubscriptionPlan) => ({ ...sub, validityDays: this.getDiffernceOfTwoDates(sub.validityFrom, sub.validityTo) }))
      this.subscriptionCount = response.subscriptionhistoriescount;
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
    this.router.navigate(['employer-subscription'])
  }
}
