import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageFacadeService } from '../../page-facade.service';
import { SubscriptionService } from '../subscription.service';
import { ChipModule } from 'primeng/chip';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import {SelectModule} from 'primeng/select';
import { Router } from '@angular/router';

@Component({
    selector: 'uni-college-subscription-view',
    imports: [CommonModule, ChipModule, MultiSelectModule, FormsModule, SelectModule],
    templateUrl: './college-subscription-view.component.html',
    styleUrls: ['./college-subscription-view.component.scss']
})
export class CollegeSubscriptionViewComponent implements OnInit {

  countryList: any = [];
  subscriptionList: any = [];
  subscriptionTopupList: any = [];


  constructor(private pageService: PageFacadeService, private subscriptionService: SubscriptionService,
    private router: Router) { }

  ngOnInit(): void {
    this.getCountryList();
  }

  getCountryList() {
    this.pageService.getCountries().subscribe(response => {
      this.countryList = response;
      this.getSubscriptionList();
    });
  }

  getSubscriptionList() {
    let data = {
      page: 1,
      perpage: 1000,
      studenttype: 2
    }
    this.subscriptionService.getSubscriptions(data).subscribe((response) => {
      this.subscriptionList = response.subscriptions;
      this.subscriptionList.forEach((item: any) => {
        item.country = item.country.split(',').map(Number);
        let filteredCountryIds = item.country;
        item.selected = false;
        item.selectedCoutry = {};
        item.filteredCountryList = this.countryList.filter((data: any) => filteredCountryIds.includes(data.id));
      });
    });
  }

  navigateSubscription() {
    this.router.navigate(['subscription']);
  }

  selectedSubscriptionPlan(sub: any) {
    this.subscriptionList.forEach((item: any) => {
      item.selected = false;
      if (sub.id == item.id) {
        item.selected = true;
      }
    });
  }
}
