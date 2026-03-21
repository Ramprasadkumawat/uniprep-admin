import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageFacadeService } from '../../page-facade.service';
import { SubscriptionService } from '../subscription.service';
import { ChipModule } from 'primeng/chip';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import {SelectModule} from 'primeng/select';
import { Router } from '@angular/router';
import { TabsModule } from 'primeng/tabs';

@Component({
    selector: 'uni-student-subscription-view',
    imports: [CommonModule, ChipModule, MultiSelectModule, FormsModule, SelectModule, TabsModule],
    templateUrl: './student-subscription-view.component.html',
    styleUrls: ['./student-subscription-view.component.scss']
})
export class StudentSubscriptionViewComponent implements OnInit {

  countryList: any = [];
  subscriptionList: any = [];
  basesubscription = true;
  topupcountries = false;
  subscriptionTopupList: any = [];
  currency: string = "";
  timeLeftInfoCard: any

  constructor(private pageService: PageFacadeService, private subscriptionService: SubscriptionService,
    private router: Router) { }

  ngOnInit(): void {
    this.getCountryList();
    //this.getSubscriptionTopupList();
    this.getSubscriptionList();
    this.timeLeftInfoCard = localStorage.getItem('time_card_info')
  }

  getCountryList() {
    this.pageService.getCountries().subscribe(response => {
      this.countryList = response;
    //  this.getSubscriptionListold();
    });
  }

  getSubscriptionList() {
    let data = {
      page: 1,
      perpage: 1000,
      studenttype: 1,
     // country: "INR",
    //  continent: "",
      monthly_plan: 6,
    }

    this.subscriptionService.getSubscriptions(data).subscribe((response) => {
      const mostPopularOnes = response.subscriptions.filter((item: any) => item.popular === 1);
      const filteredData = response.subscriptions.filter((item: any) => item.popular !== 1);
      filteredData.splice(1, 0, ...mostPopularOnes);
      this.subscriptionList = filteredData;
      this.subscriptionList.forEach((item: any) => {
        item.country = item.country.split(',').map(Number);
        let filteredCountryIds = item.country;
        item.selected = false;
        item.selectedCountry = {};
        // item.filteredCountryList = this.countryList.filter((data: any) => filteredCountryIds.includes(data.id));
        item.filteredCountryList = this.countryList;
        item.selectedCountry = 2;
        item.isActive = item.popular == 1 ? true : false;
        this.currency = item.currency;
      });
    });
  }

  getSubscriptionListold() {
    let data = {
      page: 1,
      perpage: 1000,
      adminstudenttype: 1
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

  getSubscriptionTopupList() {
    this.subscriptionService.getSubscriptionTopups().subscribe((response) => {
      this.subscriptionTopupList = response.topups;
      this.subscriptionTopupList.forEach((item: any) => {
        item.price = Number(item.price);
        item.countries = item.countries.split(',').map(Number);
        let filteredCountryIds = item.countries;
        item.selected = false;
        item.selectedCoutriesList = [];
        item.filteredCountryList = this.countryList.filter((data: any) => filteredCountryIds.includes(data.id));
      });
    });
  }


  navigateSubscription() {
    this.router.navigate(['subscription'])
  }
  baseSubscription() {
    this.basesubscription = true;
    this.topupcountries = false;
  }
  topupValidity() {
    this.basesubscription = false;
    this.topupcountries = true;
  }

  selectedSubscriptionPlan(sub: any) {
    this.subscriptionList.forEach((item: any) => {
      item.selected = false;
      if (sub.id == item.id) {
        item.selected = true;
      }
    });
  }

  selectedTopupCountryPlan(sub: any) {
    if(sub?.selectedCoutriesList?.length > 0) {
      this.subscriptionTopupList.forEach((item: any) => {
        item.selected = false;
        if (sub.id == item.id) {
          item.selected = true;
        }
      });
    }
  }

  removeCountry(subId: number, selectedId: number) {
    this.subscriptionTopupList.forEach((item: any) => {
      if (subId == item.id) {
        item.selectedCoutriesList = item.selectedCoutriesList.filter((data: any) => data.id !== selectedId);
      }
    });
  }

}
