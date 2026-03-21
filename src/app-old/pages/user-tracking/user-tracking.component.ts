import {Component, OnInit} from '@angular/core'
import {FormBuilder, FormGroup, Validators} from "@angular/forms"
import {UserTrackingService} from "./user-tracking.service"

@Component({
    selector: 'uni-user-tracking',
    templateUrl: './user-tracking.component.html',
    styleUrls: ['./user-tracking.component.scss'],
    standalone: false
})
export class UserTrackingComponent implements OnInit {
  advanceFilter: FormGroup
  sourceTypeList: any[] =[]
  sourceTypeName: any[] =[]
  locationList: any [] =[]
  countryList: any[] =[]
  deviceList: any[] =[]
  totalUserTrackingCount: any
  totalActiveUser: any
  totalAverageHours: any
  loadUserTrackingData: any[] = []
  page: number = 1
  first: number = 0
  pageSize: number = 100
  constructor(private userTrackingService: UserTrackingService, private fb: FormBuilder,) { }

  ngOnInit() {
    this.init()
    this.advanceFilter = this.fb.group({
      fromdate: ['', Validators.required],
      todate: ['', [Validators.required]],
      username: ['', [Validators.required]],
      source_type: ['', [Validators.required]],
      source_user_id: ['', [Validators.required]],
      location: ['', [Validators.required]],
      country: ['', [Validators.required]],
      device: ['', [Validators.required]],
    });
    this.loadInit()
  }

  init(){
    this.getSourceType()
    this.getLocation()
    this.getCountryList()
    this.getSourceNameDropdown()
    this.getDevice()
  }

  getDevice(){
    this.userTrackingService.getDevice().subscribe((res: any) => {
      this.deviceList = res
    })
  }

  getSourceType() {
    this.userTrackingService.getSourceType().subscribe((res: any) => {
      this.sourceTypeList = res
    })
  }

  getLocation() {
    this.userTrackingService.getLocation().subscribe((res: any) => {
      this.locationList = res
    })
  }

  getCountryList() {
    this.userTrackingService.getCountryList().subscribe((res: any) => {
      this.countryList = res
    })
  }

  getSourceNameDropdown() {
    this.userTrackingService.getSourceNameDropdown().subscribe((res: any) => {
      this.sourceTypeName = res
    })
  }

  loadInit(){
    this.userTrackingService.getUserTrackingList().subscribe((res: any)  =>{
      this.loadUserTrackingData = res.data
      this.totalUserTrackingCount = res.count
      this.totalActiveUser = res.total_active_user
      this.totalAverageHours = res.total_average_hours
    })
  }

  submitFilter(){
    this.userTrackingService.getUpdateFilter(this.advanceFilter.value).subscribe((res: any)  =>{
      this.loadUserTrackingData = res.data
      this.totalUserTrackingCount = res.count
      this.totalActiveUser = res.total_active_user
      this.totalAverageHours = res.total_average_hours
    })
  }

  resetFilter(){
    this.advanceFilter.reset()
    this.init()
    this.loadInit()
  }

  updateUserTrackingData(){
    this.loadInit()
  }

  exportUserTracking(){
    this.userTrackingService.exportLeadUserTracking(this.advanceFilter.value).subscribe((res: any) => {
      this.userTrackingService.downloadFile(res.link).subscribe((blob) => {
        const a = document.createElement("a");
        const objectUrl = window.URL.createObjectURL(blob);

        a.href = objectUrl;
        a.download = "userTrackingLeads.csv";
        document.body.appendChild(a);

        a.click();
        window.URL.revokeObjectURL(objectUrl);
        document.body.removeChild(a);
      });
    })
  }

  pageChange(event: any) {
    if (this.pageSize == event.rows) {
      this.page = event.first / event.rows + 1
    } else {
      this.page = 1
    }
    this.pageSize = event.rows
    //this.getSubscribers({ ...this.subscriberObj, page: this.page, perpage: this.pageSize })
  }

  difference: any
  updateSessionTime(item: any){
    this.difference = this.calculateDifference(item.session_start_at, item.session_end_at)
    return `${this.difference.hours} hours ${this.difference.minutes} minutes`
  }

  calculateDifference(start: string, end: string): { hours: number, minutes: number } {
    const startDate = this.parseDate(start);
    const endDate = this.parseDate(end);

    if (!startDate || !endDate) {
      return { hours: 0, minutes: 0 }; // Return a default value or handle the error appropriately
    }

    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return { hours: diffHours, minutes: minutes };
  }

  parseDate(dateStr: string): Date | null {

    if (!dateStr) {
      return null;
    }

    const [datePart, timePart] = dateStr.split(' ');
    if (!datePart || !timePart) {
      return null;
    }

    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);

    if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hours) || isNaN(minutes)) {
      return null;
    }

    return new Date(year, month - 1, day, hours, minutes);
  }
}
