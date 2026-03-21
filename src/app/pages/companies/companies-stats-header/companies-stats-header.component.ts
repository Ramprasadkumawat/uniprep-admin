import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";

@Component({
  selector: "uni-companies-stats-header",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./companies-stats-header.component.html",
  styleUrl: "./companies-stats-header.component.scss",
})
export class CompaniesStatsHeaderComponent  {
  @Input() todayData: any = {};
  
  // Add missing inputs used in the template
  @Input() totalCompanies: number = 0;
  @Input() totalUsers: number = 0;
  @Input() totalRevenue: any = 0;
  @Input() activeSubscribedEmployers: number = 0;
  @Input() totalActiveJobs: number = 0;
  @Input() totalJobs:any=0;
  @Input() totalApplicants: number = 0;
  @Input() totalCardsSeen: any = 0;
  @Input() totalRevenuePercentage: any = 0;
  @Input() totalJobsPercentage: any = 0;
  @Input() totalActiveJobsPercentage: any = 0;
  @Input() totalApplicantsPercentage: any = 0;
  @Input() totalActiveSubscriptionsPercentage: any = 0;
}