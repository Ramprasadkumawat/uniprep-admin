import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {SelectModule} from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import { UserDashboardService } from "src/app/pages/user-dashboard/user-dashboard.service";
import {MultiSelectModule} from 'primeng/multiselect';
import { FormsModule , FormGroup , FormControl , FormBuilder , NgForm } from '@angular/forms';
import { filter, subscribeOn } from 'rxjs';
import { Button, ButtonModule } from 'primeng/button';
import {ChartModule} from 'primeng/chart';
import Highcharts from 'highcharts';
import 'highcharts/modules/wordcloud';

interface country {
  id: number,
  country: string,
  flag: string,
  status: number,
  created_at: string,
  updated_at: string
};

interface location {
  id: number,
  state: string,
  district: string,
  status:number,
  created_at: string,
  updated_at: string
}

interface sourcetype {
  id: number,
  name : string
}

interface status {
  id: number,
  status_name : string
}

interface company{
  id:number,
  companyName : string
}

interface program {
  id:number,
  programlevel:string,
  status:number,
  created_at: string,
  updated_at: string
}

interface year{
  year: number
}

interface month{
  id:number,
  month:string
}


@Component({
    selector: 'uni-revenuedashboard',
    imports: [
        CommonModule,ButtonModule, InputTextModule, TabsModule, TableModule, AccordionModule, SelectModule, TextareaModule, ReactiveFormsModule, ConfirmDialogModule, ToastModule, MultiSelectModule, FormsModule, ChartModule
    ],
    templateUrl: './revenuedashboard.component.html',
    styleUrls: ['./revenuedashboard.component.scss']
})
export class RevenuedashboardComponent implements OnInit {

  countrylist: any;
  locationlist: any;
  programlist: any;

  countries: country[] = [];
  locations: location[] = [];
  programs: program[] = [];
  sourcetypes: sourcetype[] = [];
  statuses: status[] = [];
  companies: status[] = [];
  // selectedlocations: location[];
  // selectedcountries: country[];
  // selectedprograms: program[];
  years: year[];
  selectyears: year[];
  months: month[];
  selectedmonths: month[];

  filterForm:FormGroup;
  filterdata: any;
  dashboardCardCount: any;
  cdata: any;
  usersDaily: any;
  usersDailyRevenue: any;
  usersDailyChart: any;
  basicData: any;
  bardata: any
  sourcelist: any;
  programleveldata: any;
  programlevelchartdata: any;
  usersdailychart: any;
  sourcechartdata: any;
  sourcedata: any;
  countryChartdata: any;
  planchartdata: any;
  revenueUsersDailyChart: any;
  revenueDailyChart: any;
  revenueDailyUser: any;
  datarevenueregion: any;
  options: any;
  dailyOptions: any;
  sourceOptions: any;
  planOptions: any;
  datarevenuecountry: any;
  usersRevenueSourceChartData: any;
  totalrev: any;
  userTypeGraphData: { labels: any; datasets: { data: any; }[]; };
  userPlanRevenueGraph: { labels: any; datasets: { data: any; }[]; };
  userDailyRevenueGraph: { labels: any; datasets: { data: any; label:any }[]; };
  noOfPayments: number = 0;


  constructor(private service: UserDashboardService,private formbuilder: FormBuilder) { 

    this.filterForm = formbuilder.group({
      createdFrom:new FormControl(),
      createdTo:new FormControl(),
      country:new FormControl(),
      company:new FormControl(),
      location:new FormControl(),
      programlevel:new FormControl(),
      intakeyear:new FormControl(),
      intakemonth:new FormControl(),
      status:new FormControl(),
      source:new FormControl(),
      sourcename:new FormControl(),
    });
  
    this.service.GetCountryList().subscribe((response) => {
      this.countries = response;
    });
    // this.selectedcountries = [];
  
    this.service.GetLocationList().subscribe((response) =>{
      this.locations = response;
    });
    // this.selectedlocations = [];
  
    this.service.GetProgramList().subscribe((response) =>{
      this.programs = response;
    });
    // this.selectedprograms = [];
  
    this.service.GetSourcetypeList().subscribe((response) =>{
      this.sourcetypes = response;
    });
  
    this.service.GetStatusList().subscribe((response) =>{
      this.statuses = response;
    });
  
    this.service.GetInternalCompanies().subscribe((response) =>{
      this.companies = response;
    })
  
  
  
    this.years = [
      {year:2022},
      {year:2023},
      {year:2024},
      {year:2025},
      {year:2026}
    ]
    this.selectyears = [];
  
    this.months =[
      {id:1, month:"January"},
      {id:2, month:"February"},
      {id:3, month:"March"},
      {id:4, month:"April"},
      {id:5, month:"May"},
      {id:6, month:"June"},
      {id:7, month:"July"},
      {id:8, month:"August"},
      {id:9, month:"September"},
      {id:10, month:"October"},
      {id:11, month:"November"},
      {id:12, month:"December"},
    ]
    this.selectedmonths = [];
  
  
  

  }

  ngOnInit(): void {
    this.GetRevenueDailyUser();
    this.GetRevenueSourceWise();
    this.GetRevenueTotal();
    this.getPlanRevenueData();
    this.getDailyRevenueData();
  }

  postData(filterForm: any){
    var datafrom ={
      createdFrom: filterForm.controls.createdFrom.value,
      createdTo: filterForm.controls.createdTo.value,
      country: filterForm.controls.country.value,
      location: filterForm.controls.location.value,
      programlevel: filterForm.controls.programlevel.value,
      intakeyear: filterForm.controls.intakeyear.value,
      intakemonth: filterForm.controls.intakemonth.value,
      status: filterForm.controls.status.value,
      source: filterForm.controls.source.value,
      sourcename: filterForm.controls.sourcename.value,
    } 
    // alert(datafrom); 

    // ------------------------------------------------    Total Revenue  --------------------------------------
    this.service.revenueTotal(datafrom).subscribe((res) => {
      this.totalrev = res.totalRevenue;
      this.noOfPayments = res.totalpaymentcount;

    });

    // ---------------------------------------------------- Daily Wise Graph  ----------------------------------------------

    this.service.getDailyRevenue(datafrom).subscribe((res) => {
      // this.usersDaily = Response;
      this.usersDailyRevenue = res
      this.userDailyRevenueGraph = {
        labels: res.data,
        datasets: [
            {   label: 'Revenue',
                data: res.money,
            }
        ]
      };
    });

      this.service.revenueSourceWiseData(datafrom).subscribe((res) => {
      // this.usersDaily = Response;
      this.usersRevenueSourceChartData = {
        labels: res.region,
        datasets: [
            {
                data: res.count,
            }
        ]
      };
    });

    this.service.getPlanRevenue(datafrom).subscribe((res) => {
      // this.usersDaily = Response;
      this.userPlanRevenueGraph = {
        labels: res.plan,
        datasets: [
            {
                data: res.money,
            }
        ]
      };
    });
  }


  getSource(source: any){
    let sourcetyp_id = {
      sourcetype: source
    }
    this.service.GetSourceBySourcetype(sourcetyp_id).subscribe((Response) => {
      this.sourcelist = Response;
    })
  }

  DashboardCardCount(){
     this.service.GetDashboadCardCount(this.filterdata).subscribe((Response) => {
      this.dashboardCardCount = Response;
    })
  }

  GetRevenueDailyUser(){
    let data;
    this.service.revenuDailyUserData(data).subscribe((Response) => {
      console.log(Response);
      this.usersDaily = Response;
      this.usersdailychart = {
        labels: this.usersDaily.date,
        datasets: [
            {
                label: 'Daily Users',
                data: this.usersDaily.count,
                fill: false,
                tension: .4
            }
        ]
      };
    });
    this.dailyOptions = {
      plugins: {
        legend: {
          display: true,
          position: "right",
          labels: {
            color: "#495057",
          },
        },
      },
    };
  }

  GetRevenueTotal(){
    let data;
    this.service.revenueTotal(data).subscribe((res) => {
      this.totalrev = res.totalRevenue;
      this.noOfPayments = res.totalpaymentcount;
    })
  }

  GetRevenueSourceWise(){
    let data;
    this.service.revenueSourceWiseData(data).subscribe((res) => {
      // this.usersDaily = Response;
      this.usersRevenueSourceChartData = {
        labels: res.region,
        datasets: [
            {
                data: res.count,
            }
        ]
      };
    });
    this.sourceOptions = {
      plugins: {
        legend: {
          display: true,
          position: "right",
          labels: {
            color: "#495057",
          },
        },
      },
    };
  }

  GetRevenueRegionWise(){
    this.service.revenueRegionWiseData(this.filterdata).subscribe((res) =>{
      this.datarevenueregion = res;

      Highcharts.setOptions({
      });

      this.options = {
        accessibility: {
            screenReaderSection: {
                beforeChartFormat: '<h5>{chartTitle}</h5>' +
                    '<div>{chartSubtitle}</div>' +
                    '<div>{chartLongdesc}</div>' +
                    '<div>{viewTableButton}</div>'
            }
        },
        series: [{
            type: 'wordcloud',
            data: this.datarevenueregion,
            name: 'Occurrences'
        }],
        title: {
            text: ''
        }
    };
      Highcharts.chart('chart-revenuechart', this.options);
    })
  }


  GetRevenueCountryWise(){
    this.service.revenueCountryWiseData(this.filterdata).subscribe((res) =>{
      this.datarevenueregion = res;

      Highcharts.setOptions({
      });

      this.options = {
        accessibility: {
            screenReaderSection: {
                beforeChartFormat: '<h5>{chartTitle}</h5>' +
                    '<div>{chartSubtitle}</div>' +
                    '<div>{chartLongdesc}</div>' +
                    '<div>{viewTableButton}</div>'
            }
        },
        series: [{
            type: 'wordcloud',
            data: this.datarevenueregion,
            name: 'Occurrences'
        }],
        title: {
            text: ''
        }
    };
      Highcharts.chart('chart-countrychart', this.options);
    })
  }


  getUserTypeGraphData(){
    let data;
    this.service.GetUserTypeGraphData(data).subscribe((res) => {
      // this.usersDaily = Response;
      this.userTypeGraphData = {
        labels: res.usertype,
        datasets: [
            {
                data: res.usercount,
            }
        ]
      };
    });
  }

  getPlanRevenueData(){
    let data;
    this.service.getPlanRevenue(data).subscribe((res) => {
      // this.usersDaily = Response;
      this.userPlanRevenueGraph = {
        labels: res.plan,
        datasets: [
            {
                data: res.money,
            }
        ]
      };
    });
    this.planOptions = {
      plugins: {
        legend: {
          display: true,
          position: "right",
          labels: {
            color: "#495057",
          },
        },
      },
    };
  }

  getDailyRevenueData(){
    let data;
    this.service.getDailyRevenue(data).subscribe((res) => {
      // this.usersDaily = Response;
      this.usersDailyRevenue = res
      this.userDailyRevenueGraph = {
        labels: res.data,
        datasets: [
            {   
                label: "Revenue",
                data: res.money,
            }
        ]
      };
    });
  }

	resetFilter(){
		this.filterForm.reset();
		this.ngOnInit();
	}

  lastRefreshedTime = new Date().toLocaleString();
  refreshDashboardData() {
    this.lastRefreshedTime = new Date().toLocaleString();
    this.ngOnInit();
  }
}
