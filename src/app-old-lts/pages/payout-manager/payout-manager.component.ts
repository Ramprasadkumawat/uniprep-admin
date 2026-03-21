import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import {SelectModule} from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { MarketingorgService } from '../partneruser/marketingorg.service';
import { SubscriberService } from '../subscribers/subscriber.service';
import { Observable } from 'rxjs';
import { SubscriptionPlan } from 'src/app/@Models/subscription';
import { SubscriptionService } from '../subscription/subscription.service';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
    selector: 'uni-payout-manager',
    templateUrl: './payout-manager.component.html',
    styleUrls: ['./payout-manager.component.scss'],
    imports: [
        CommonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule,
        TextareaModule, ReactiveFormsModule, FormsModule, DatePickerModule, MultiSelectModule,
    ]
})
export class PayoutManagerComponent implements OnInit {
  filterForm: FormGroup;
  payoutList: any[] = [];
  datacount: number = 0;
  pageSize = 10;
  totalPayoutDue: number = 0;
  statusOptions = [
    { label: 'Completed', value: 0 },
    { label: 'Failed', value: 0 },
  ];
  subscriptions: any = [];
  subscriptions$!: Observable<SubscriptionPlan[]>;
  constructor(private router: Router, private subscriberService: SubscriberService, private fb: FormBuilder, private toaster: MessageService, private service: MarketingorgService,
    private subscriptionService: SubscriptionService
  ) {
    this.filterForm = this.fb.group({
      inst_name: [''],
      subscription_id: [], // multi-select
      status: [],
      fromDate: [''],
      toDate: ['']
    });
  }

  ngOnInit(): void {
    this.getPayOutList(this.data);
    this.loadSubscriptions();
  }
  data: any = { page: 1, perpage: this.pageSize };
  page: number = 1;
  getPayOutList(data: any) {
    this.payoutList = []
    this.service.getPayOutManagerList(data).subscribe((res) => {
      this.payoutList = res.transactions;
      this.datacount = res.total_payout;
      this.totalPayoutDue = res.total_pending_payout + res.total_failed_payout
    })
  }
  pageChange(event: any) {
    if (this.pageSize == event.rows) {
      this.page = event.first / event.rows + 1;
    } else {
      this.page = 1;
    }
    this.pageSize = event.rows;
    var data = {
      page: this.page,
      perPage: this.pageSize,
      organizationName: this.filterForm.value.inst_name,
      subscriptionplan: this.filterForm.value.subscription_id,
      datefrom: this.filterForm.value.fromDate ? this.changeYearFormat(this.filterForm.value.fromDate) : null,
      dateto: this.filterForm.value.toDate ? this.changeYearFormat(this.filterForm.value.toDate) : null,
      payout_status: this.filterForm.value.status,
    }
    this.getPayOutList(data);
  }
  changeYearFormat(value) {
    const inputDateString = value;
    const inputDate = new Date(inputDateString);
    const year = inputDate.getFullYear();
    const month = inputDate.getMonth() + 1;
    const day = inputDate.getDate();
    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
    return formattedDate;
  }
  filterFormValue() {
    var data = {
      page: 1,
      perPage: 10,
      organizationName: this.filterForm.value.inst_name,
      subscriptionplan: this.filterForm.value.subscription_id,
      datefrom: this.filterForm.value.fromDate ? this.changeYearFormat(this.filterForm.value.fromDate) : null,
      dateto: this.filterForm.value.toDate ? this.changeYearFormat(this.filterForm.value.toDate) : null,
      payout_status: this.filterForm.value.status,
    }
    this.getPayOutList(data);
  }
  loadSubscriptions() {
    const params: any = {};
    this.subscriptionService.getSubscriptionDropdownList(params).subscribe((response) => {
      this.subscriptions = response.subscriptions.map((sub: SubscriptionPlan) => ({
        id: sub.id,
        subscription: sub.subscription_plan,
      }));
      this.subscriptions = [
        { id: null, subscription: "Select" },
        ...this.subscriptions,
      ];
    });
  }
  resetField() {
    this.filterForm.reset();
    var data = {
      page: 1,
      perPage: 10,
    }
    this.getPayOutList(data);
  }
  openOrganizationDetails(id: any) {
    this.router.navigate(['/organization-details', id]);
  }
}
