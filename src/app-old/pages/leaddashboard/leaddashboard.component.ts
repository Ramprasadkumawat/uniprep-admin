import { ChangeDetectorRef, Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { AccordionModule } from "primeng/accordion"
import { InputTextModule } from "primeng/inputtext"
import { TableModule } from "primeng/table"
import { ButtonModule } from "primeng/button"
import { filter, forkJoin, mergeMap, Observable, of } from "rxjs"
import { CreateUserParams, User, UserType } from "../../@Models/user.model"
import {SelectModule} from "primeng/select"
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { login } from "../../Auth/store/actions"
import { MessageService } from "primeng/api"
import { CustomValidators } from "src/app/@Supports/validator"
import { AuthService } from "src/app/Auth/auth.service"
import Highcharts from 'highcharts';
import 'highcharts/modules/wordcloud';

import { LeaddashboardService } from "./leaddashboard.service"
import { ChartModule } from "primeng/chart"

interface country {
	id: number
	country: string
	flag: string
	status: number
	created_at: string
	updated_at: string
}
interface sourcetype {
	id: number
	name: string
}
interface program {
	id: number
	programlevel: string
	status: number
	created_at: string
	updated_at: string
}
@Component({
    selector: "uni-leaddashboard",
    templateUrl: "./leaddashboard.component.html",
    styleUrls: ["./leaddashboard.component.scss"],
    imports: [CommonModule, AccordionModule, InputTextModule, TableModule, ButtonModule, SelectModule, ReactiveFormsModule, ChartModule]
})
export class LeaddashboardComponent implements OnInit {
	filterForm: FormGroup
	filterdata: any
	dataPassingYear: any
	options: any
	dailyOptions: any
	dashboardCardCount: any
	usersDaily: any
	usersdailychart: any
	countries: country[] = []
	RegionOptions = []
	leadstatus = []
	sourcelist: any
	sourcetypes: sourcetype[] = []
	sourceid: any
	programs: program[] = []
	genderchart: any
	filterform: FormGroup
	passingyear = [
		{ id: "", name: "" },
		{ id: "2020", name: "2020" },
		{ id: "2021", name: "2021" },
		{ id: "2022", name: "2022" },
		{ id: "2023", name: "2023" },
	]
	lastdegreepassingyear = [
		{ id: "", name: "" },
		{ id: "2020", name: "2020" },
		{ id: "2021", name: "2021" },
		{ id: "2022", name: "2022" },
		{ id: "2023", name: "2023" },
	]
	constructor(private fb: FormBuilder, private authservice: AuthService, private service: LeaddashboardService) {
		this.filterform = this.fb.group({
			createdFrom: [""],
			createdTo: [""],
			country: [""],
			region: [""],
			lastdegreecompleted: [""],
			passingyear: [""],
			leadstatus: [""],
			source: [""],
			sourcename: [""],
			programlevel: [""],
		})
	}

	ngOnInit(): void {
		this.userdataid()
		setTimeout(() => {
			this.passingYearWiseData()
			this.DashboardCardCount()
			this.getUsersDaily()
			this.GetGenderChartData()
		}, 1000)
		this.service.GetCountryList().subscribe((response) => {
			this.countries = response
		})

		this.service.getregion().subscribe((res) => {
			this.RegionOptions = res
		})
		this.service.getleadstatus().subscribe((res) => {
			this.leadstatus = res
		})
		this.service.GetSourcetypeList().subscribe((response) => {
			this.sourcetypes = response
		})
		this.service.GetProgramList().subscribe((response) => {
			this.programs = response
		})
	}
	source: any
	sourcetype: any
	userdataid() {
		this.authservice.getUserDetails$
			.pipe(filter(user => !!user))   // only pass non-null values
			.subscribe(res => {
				this.source = res[0].source
				this.sourcetype = res[0].source_type
			})
	}
	DashboardCardCount() {
		var data = {
			source: this.source,
			source_type: this.sourcetype,
		}
		this.service.GetDashboadCardCount(data).subscribe((Response: any) => {
			this.dashboardCardCount = Response
		})
	}
	getUsersDaily() {
		var data = {
			source: this.source,
			source_type: this.sourcetype,
		};
		this.service.GetUsersDaily(data).subscribe((Response) => {
			this.usersDaily = Response;
			this.usersdailychart = {
				labels: this.usersDaily.date,
				datasets: [
					{
						label: "Daily Users",
						data: this.usersDaily.count,
						fill: false,
						tension: 0.4,
					},
				],
			};
			this.dailyOptions = {
				legend: {
					display: true,
					position: "right",
					labels: {
						color: "#495057",
					},
				},
			};
		});
	}
	passingYearWiseData() {
		var data = {
			source: this.source,
			source_type: this.sourcetype,
		}

		this.service.GetPassingYearData(data).subscribe((res) => {
			this.dataPassingYear = res

			Highcharts.setOptions({})

			this.options = {
				accessibility: {
					screenReaderSection: {
						beforeChartFormat: "<h5>{chartTitle}</h5>" + "<div>{chartSubtitle}</div>" + "<div>{chartLongdesc}</div>" + "<div>{viewTableButton}</div>",
					},
				},
				series: [
					{
						type: "wordcloud",
						data: this.dataPassingYear,
						name: "Occurrences",
					},
				],
				title: {
					text: "",
				},
			}
			Highcharts.chart("chart-passingwisechar", this.options)
		})
	}
	getSource() {
		this.sourcelist = []

		let sourcetyp_id = {
			sourcetype: this.sourceid,
		}
		this.service.GetSourceBySourcetype(sourcetyp_id).subscribe((Response) => {
			this.sourcelist = Response
		})
	}
	GetGenderChartData() {
		let sourcetyp_id = {
			sourcetype: this.sourceid,
		}
		this.service.GetGenderChartData(sourcetyp_id).subscribe((response) => {
			// this.countrydata = Response;

			this.genderchart = {
				labels: response.data,
				datasets: [
					{
						data: response.count,
					},
				],
			}
		})
	}
	submitForm() {
		// createdFrom: new FormControl(),
		// createdTo: new FormControl(),
		// country: new FormControl(),
		// region: new FormControl(),
		// lastdegreecompleted: new FormControl(),
		// passingyear: new FormControl(),
		// leadstatus: new FormControl(),
		// source: new FormControl(),
		// sourcename: new FormControl(),
		// programlevel: new FormControl()
		var data = {
			createdFrom: this.filterform.value.createdFrom,
			createdTo: this.filterform.value.createdTo,
			country: this.filterform.value.country,
			location: this.filterform.value.region,
			programlevel: this.filterform.value.programlevel,
			status: this.filterform.value.leadstatus,
			source: this.filterform.value.source,
			sourcename: this.filterform.value.sourcename,
			passingyear: this.filterform.value.passingyear,
			sourcetype: this.sourceid,
		}
		//  graph1
		this.service.GetGenderChartData(data).subscribe((response) => {
			// this.countrydata = Response;

			this.genderchart = {
				labels: response.data,
				datasets: [
					{
						data: response.count,
					},
				],
			}
		})
		// graph2
		this.service.GetUsersDaily(data).subscribe((Response) => {
			this.usersDaily = Response
			this.usersdailychart = {
				labels: this.usersDaily.date,
				datasets: [
					{
						label: "Daily Users",
						data: this.usersDaily.count,
						fill: false,
						tension: 0.4,
					},
				],
			}
		})
		// graph3
		this.service.GetPassingYearData(data).subscribe((res) => {
			this.dataPassingYear = res

			Highcharts.setOptions({})

			this.options = {
				accessibility: {
					screenReaderSection: {
						beforeChartFormat: "<h5>{chartTitle}</h5>" + "<div>{chartSubtitle}</div>" + "<div>{chartLongdesc}</div>" + "<div>{viewTableButton}</div>",
					},
				},
				series: [
					{
						type: "wordcloud",
						data: this.dataPassingYear,
						name: "Occurrences",
					},
				],
				title: {
					text: "",
				},
			}
			Highcharts.chart("chart-passingwisechar", this.options)
		})
		// count
		this.service.GetDashboadCardCount(data).subscribe((Response: any) => {
			this.dashboardCardCount = Response
		})
	}
	resetfilter() {
		this.filterform.reset();
		this.ngOnInit();
	}
}
