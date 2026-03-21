import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from "@angular/core";
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from "@angular/router";
import { filter } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "src/app/Auth/auth.service";

declare var adminUser: any;
declare var subAdmin: any;
declare var marketingRepresentativeUser: any;
declare var employeeUser: any;
declare var freelancerUser: any;
declare var informationReviewUser: any;
declare var staffUser: any;
declare var collegeUser: any;
declare var collegeStudentUser: any;
declare var directStudentUser: any;

export interface SideMenu {
  title: string;
  icon: string;
  url: string;
  /** Optional query params for routerLink (e.g. { create: '1' } for Create Job) */
  queryParams?: { [key: string]: string };
  expanded?: boolean;
  header?: boolean;
  children?: SideMenu[];
  active?: boolean;
  permissions: string[];
}

@Component({
  selector: "uni-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
  standalone: false,
})
export class SidenavComponent {
  @ContentChild("appTitle") appTitle!: TemplateRef<any>;
  @Output() active = new EventEmitter<SideMenu>();
  @Input() isOverlap = false;

  @Input() menus: SideMenu[] = [
    // {
    //   title: 'DashBoard',
    //   url: '/dashboard',
    //   icon: 'fa-solid fa-objects-column',
    //   permissions: [],
    // },
    {
      title: "Lead Dashboard",
      url: "/userdashboard",
      icon: "fa-solid fa-objects-column",
      permissions: [],
    },
    {
      title: "Revenue Dashboard",
      url: "/revenuedashboard",
      icon: "fa-solid fa-objects-column",
      permissions: [],
    },
    {
      title: "User Tracking",
      url: "/user-tracking",
      icon: "fa-solid fa-user-group",
      permissions: [],
    },
    {
      title: "Credit Sheet",
      url: "/creditsheet",
      icon: "fa-solid fa fa-money",
      permissions: [],
    },
    {
      title: "Revenue System",
      url: "",
      icon: "",
      permissions: [],
    },
    {
      title: "Subscription",
      url: "/subscription",
      icon: "fa-solid fa-crown",
      permissions: [],
    },
    {
      title: "Employer Subscription",
      url: "/employer-subscription",
      icon: "fa-solid fa-crown",
      permissions: [],
    },
    {
      title: "Enterprise Subscription",
      url: "/enterprise-subscription",
      icon: "fa-solid fa-crown",
      permissions: [],
    },
    {
      title: "Coupon Management",
      url: "/couponmanagement",
      icon: "fa-solid fa-comments-question",
      permissions: [],
    },
    {
      title: "My Coupon",
      url: "/mycoupon",
      icon: "fa-solid fa-ticket",
      permissions: [],
    },
    {
      title: "Core System",
      url: "",
      icon: "",
      permissions: [],
    },
    // {
    //   title: 'Q & A',
    //   url: '/reading',
    //   icon: 'fa-solid fa-folder-open',
    //   permissions: [],
    //   children: [
    //     {
    //       title: 'Study',
    //       url: "",
    //       icon: "",
    //       permissions: [],
    //     },
    //     {
    //       title: "k12",
    //       url: "/reading/k12-board",
    //       icon: "",
    //       permissions: [],
    //     },
    //     {
    //       title: "Pre-Admission",
    //       url: "/reading/sub-category/1",
    //       icon: "",
    //       permissions: [],
    //     },
    //     {
    //       title: "Post-Admission",
    //       url: "/reading/sub-category/3",
    //       icon: "",
    //       permissions: [],
    //     },
    //     {
    //       title: "University",
    //       url: "/reading/sub-category/5",
    //       icon: "",
    //       permissions: [],
    //     },
    //     {
    //       title: 'Career',
    //       url: "",
    //       icon: "",
    //       permissions: [],
    //     },
    //     {
    //       title: "Career Hub",
    //       url: "/reading/sub-category/4",
    //       icon: "",
    //       permissions: [],
    //     },
    //     {
    //       title: "Learning Hub",
    //       url: "/reading/learning-hub",
    //       icon: "",
    //       permissions: [],
    //     },
    //     {
    //       title: "Skill Mastery",
    //       url: "reading/sub-category/10",
    //       icon: "",
    //       permissions: [],
    //     },
    //     {
    //       title: 'Life',
    //       url: "",
    //       icon: "",
    //       permissions: [],
    //     },
    //     {
    //       title: "Life At Country",
    //       url: "/reading/sub-category/6",
    //       icon: "",
    //       permissions: [],
    //     },
    //     {
    //       title: "Travel and Tourism",
    //       url: "/reading/sub-category/7",
    //       icon: "",
    //       permissions: [],
    //     }
    //   ]
    // },
    {
      title: "Language Hub",
      url: "/language-hub/category",
      icon: "fa-solid fa-folder-open",
      permissions: [],
    },
    // {
    //   title: 'Q & A Summary',
    //   url: '/questionsummary',
    //   icon: 'fa-solid fa-folder-open',
    //   permissions: []
    // },
    // {
    //   title: 'Q & A Category Summary',
    //   url: '/questioncategorysummary',
    //   icon: 'fa-solid fa-folder-open',
    //   permissions: []
    // },
    {
      title: "Politician Insights",
      url: "/politician-insights",
      icon: "fa-solid fa-folder-open",
      permissions: [],
    },
    {
      title: "Quiz",
      url: "/quiz",
      icon: "fa-solid fa-stopwatch-20",
      permissions: [],
      children: [
        // {
        //   title: "Module",
        //   url: "/quiz/quizmodule",
        //   icon: "",
        //   permissions: [],
        // },
        // {
        //   title: "University",
        //   url: "/quiz/unversitylist",
        //   icon: "",
        //   permissions: [],
        // },
        {
          title: "Learning Hub",
          url: "/quiz/learninghublist",
          icon: "",
          permissions: [],
        },
        {
          title: "Language Hub",
          url: "/quiz/languagehublist",
          icon: "",
          permissions: [],
        },
        {
          title: "Skill Mastery",
          url: "/quiz/skill-mastery",
          icon: "",
          permissions: [],
        },
        {
          title: "Psychometric Test",
          url: "/quiz/psychometric-test",
          icon: "",
          permissions: [],
        },
        {
          title: "Personality Test",
          url: "/quiz/personality-test",
          icon: "",
          permissions: [],
        },
        {
          title: "Employer Test",
          url: "/quiz/employer-test",
          icon: "",
          permissions: [],
        },
        // {
        //   title: "Career Path",
        //   url: "/quiz/career-hub",
        //   icon: "",
        //   permissions: [],
        // },
      ],
    },
    {
      title: "Academic Tools",
      url: "academic-tools",
      icon: "fa-solid fa-building-columns",
      permissions: [],
    },
    {
      title: "Assessment",
      url: "",
      icon: "fa-solid fa-stopwatch-20",
      permissions: [],
      children: [
        {
          title: "Assign Assessment",
          url: "/assessment/assignassessment",
          icon: "",
          permissions: [],
        },
        {
          title: "Student Assessment",
          url: "/assessment/scholarassessment",
          icon: "",
          permissions: [],
        },
      ],
    },
    {
      title: "Founders Tool",
      url: "/foundersacadamic",
      icon: "fa-solid fa-stopwatch-20",
      permissions: [],
      children: [
        {
          title: "Founders Academy",
          url: "/foundersacadamic",
          icon: "",
          permissions: [],
        },
        {
          title: "Investor Pitch Training",
          url: "/investorpitchtraining",
          icon: "",
          permissions: [],
        },
        {
          title: "Start Up Glossary",
          url: "/startupglossary",
          icon: "",
          permissions: [],
        },
        {
          title: "Entrepreneur Skill Test",
          url: "/entrprenuerskilltest",
          icon: "",
          permissions: [],
        },
        {
          title: "Entrepreneur Proficiency Test",
          url: "/entrprenueurproficiencytest",
          icon: "",
          permissions: [],
        },
        {
          title: "Add Government Funding Oppurtunity",
          url: "/addgovernmentfund",
          icon: "",
          permissions: [],
        },
        {
          title: "Add Country Insights",
          url: "/country-insights",
          icon: "",
          permissions: [],
        },
        {
          title: "Start-up Funding Hacks",
          url: "/start-up-funding-hacks",
          icon: "",
          permissions: [],
        },
        {
          title: "Start-up Success Stories",
          url: "/start-up-success-stories",
          icon: "",
          permissions: [],
        },
        {
          title: "Start-up Failure Stories",
          url: "/start-up-failure-stories",
          icon: "",
          permissions: [],
        },
        {
          title: "Start-up Funding Hacks",
          url: "/start-up-funding-hacks",
          icon: "",
          permissions: [],
        },
        {
          title: "Start-up Funding Hacks",
          url: "/start-up-funding-hacks",
          icon: "",
          permissions: [],
        },
      ],
    },
    {
      title: "Travel Tool",
      url: "/foundersacadamic",
      icon: "fa-solid fa-stopwatch-20",
      permissions: [],
      children: [
        {
          title: "Travel Glossarey",
          url: "/travel-tools/travel-glossary",
          icon: "",
          permissions: [],
        },
      ],
    },
    {
      title: "Talent Connect",
      url: "/",
      icon: "fa-solid fa-user-tie",
      permissions: [],
      children: [
        // {
        //   title: "Companies",
        //   url: "/talent-connect/company",
        //   icon: "",
        //   permissions: [],
        // },
        // {
        //   title: "Jobs",
        //   url: "/talent-connect/jobs",
        //   icon: "",
        //   permissions: [],
        // },
        // {
        //   title: "Hiring Support",
        //   url: "/hiring-support",
        //   icon: "",
        //   permissions: [],
        // },
        {
          title: "Career Coach",
          url: "/career-coach",
          icon: "",
          permissions: [],
        },
        {
          title: "Talent Support",
          url: "/talent-support",
          icon: "",
          permissions: [],
        },
      ],
    },
    {
      title: "Companies",
      url: "/companies/view-companies",
      icon: "fa-solid fa-building",
      permissions: [],
      children: [
        {
          title: "Create Company",
          url: "/companies/create-company",
          icon: "",
          permissions: [],
        },
        {
          title: "Company Account Verification",
          url: "/talent-connect/verify-account",
          icon: "",
          permissions: [],
        },
        {
          title: "View Company",
          url: "/companies/view-companies",
          icon: "",
          permissions: [],
        },
      ],
    },
    {
      title: "Jobs",
      url: "/jobs/view-jobs",
      icon: "fa-solid fa-briefcase",
      permissions: [],
      children: [
        {
          title: "Create Job",
          url: "/jobs/create-job",
          queryParams: { create: "1" },
          icon: "",
          permissions: [],
        },
        {
          title: "View Job",
          url: "/jobs/view-jobs",
          icon: "",
          permissions: [],
        },
      ],
    },
    {
      title: "Hiring Support",
      url: "/requirement",
      icon: "fa-solid fa-clipboard-list",
      permissions: [],
      children: [
        {
          title: "Add Requirement",
          url: "/requirement/add-requirement",
          icon: "",
          permissions: [],
        },
        {
          title: "View Order",
          url: "/requirement/view-order",
          icon: "",
          permissions: [],
        },
        {
          title: "Deliver Talent",
          url: "/requirement/delivered-talents/add",
          icon: "",
          permissions: [],
        },
        {
          title: "View Delivered Talents",
          url: "/requirement/delivered-talents-list",
          icon: "",
          permissions: [],
        },
        // {
        //   title: "Map Talents",
        //   url: "/requirement/talents",
        //   icon: "fa-solid fa-user-group",
        //   permissions: [],
        // },
      ],
    },
    {
      title: "Certification",
      url: "/certification",
      icon: "fa-solid fa-file-certificate",
      permissions: [],
    },
    {
      title: "User System",
      url: "",
      icon: "",
      permissions: [],
    },
    {
      title: "Talents",
      url: "/student",
      icon: "fa-solid fa-user-plus",
      permissions: [],
      children: [
        {
          title: "Add Talents",
          url: "/subscribers/add-subscriber",
          icon: "",
          permissions: [],
        },
        {
          title: "Data Validator",
          url: "/subscribers/datavalidator",
          icon: "",
          permissions: [],
        },
        {
          title: "View Talents",
          url: "/subscribers",
          icon: "",
          permissions: [],
        },
        {
          title: "Talent Profiles",
          url: "/talent-connect/talents",
          icon: "",
          permissions: [],
        },
      ],
    },
    {
      title: "Chat",
      url: "/chat",
      icon: "fa-solid fa-comments",
      permissions: [],
    },
    {
      title: "Advisor",
      url: "/advisor-chats",
      icon: "fa-solid fa-comments",
      permissions: [],
    },
    {
      title: "Marketing System",
      url: "",
      icon: "",
      permissions: [],
    },
    {
      title: "Users Management",
      url: "/users/add-users",
      icon: "fa-solid fa-user",
      permissions: [],
      // children: [
      //   {
      //     title: "Add Users",
      //     url: "/users/add-users",
      //     icon: "",
      //     permissions: [],
      //   },
      //   {
      //     title: "Assign Institutions",
      //     url: "/users/assign-institutions",
      //     icon: "",
      //     permissions: ["Admin"],
      //   }
      // ]
    },
    {
      title: "Roles Management",
      url: "/addroles",
      icon: "fa-solid fa-user-gear",
      permissions: [],
    },
    {
      title: "Marketing Management",
      url: "/addpartner",
      icon: "fa-solid fa-user-graduate",
      permissions: [],
    },
    {
      title: "Payout Manger",
      url: "/payout-manager",
      icon: "fa-solid fa-user-graduate",
      permissions: [],
    },
    {
      title: "Contribution Program",
      url: "/contributors",
      icon: "fa-solid fa-leaf-heart",
      permissions: [],
      children: [
        {
          title: "Contributions / Donations",
          url: "/contributors/list",
          icon: "",
          permissions: [],
        },
        {
          title: "Contributors List",
          url: "/contributors",
          icon: "",
          permissions: [],
        },
        {
          title: "College List",
          url: "/contributors/college",
          icon: "",
          permissions: [],
        },
        {
          title: "Events List",
          url: "/contributors/events",
          icon: "",
          permissions: [],
        },
      ],
    },
    {
      title: "Assign Institutions",
      url: "/users/assign-institutions",
      icon: "fa-solid fa-building-columns",
      permissions: [],
    },
    // {
    //   title: 'Session Management',
    //   url: '/session',
    //   icon: 'fa-solid fa-calendar-users',
    //   permissions: [],
    //   children: [
    //     {
    //       title: "Session Manager",
    //       url: "/sessionmanager",
    //       icon: "",
    //       permissions: [],
    //     },
    //     {
    //       title: "Feedback Form",
    //       url: "/sessionfeedbackform",
    //       icon: "",
    //       permissions: [],
    //     }
    //   ]
    // },
    {
      title: "Whitelabel System",
      url: "/whitelabel",
      icon: "fa-solid fa-user-graduate",
      permissions: [],
    },
    {
      title: "Promo Emailer",
      url: "/promomailer",
      icon: "fa-solid fa-envelope",
      // icon: 'fa-solid fa-user-graduate',
      permissions: [],
    },
    {
      title: "College Management",
      url: "/collegemanagement",
      icon: "fa-solid fa-chair-office",
      permissions: [],
    },
    {
      title: "Review System",
      url: "",
      icon: "",
      permissions: [],
    },
    {
      title: "Review Users",
      url: "review/organization",
      icon: "fa-solid fa-comments",
      permissions: [],
      children: [
        {
          title: "Add Review Organizations",
          url: "review/organization",
          icon: "",
          permissions: [],
        },
        {
          title: "Add Review Users",
          url: "review/admin/user",
          icon: "",
          permissions: [],
        },
      ],
    },
    // {
    //   title: 'Q&A Add Request',
    //   url: '/suggested',
    //   icon: 'fa-solid fa-comments-question',
    //   permissions: [],
    // },
    {
      title: "Report System",
      url: "",
      icon: "",
      permissions: [],
    },
    // {
    //   title: 'General Report',
    //   url: '/generalreport',
    //   icon: 'fa-solid fa-message',
    //   permissions: [],
    // },
    // {
    //   title: 'Chat Report',
    //   url: '/ticket',
    //   icon: 'fa-solid fa-message',
    //   permissions: [],
    // },
    // {
    //   title: 'Q&A Report',
    //   url: '/reports',
    //   icon: 'fa-solid fa-comments-question',
    //   permissions: [],
    // },
    // {
    //   title: 'Ticket List',
    //   url: '/ticketslist',
    //   icon: 'fa-solid fa-user',
    //   permissions: [],
    // },
    // {
    //   title: 'Support Chat',
    //   url: '/supportchat',
    //   icon: 'fa-solid fa-user',
    //   permissions: [],
    // },
    // {
    //   title: 'Data System',
    //   url: '',
    //   icon: '',
    //   permissions: [],
    // },
    {
      title: "Report Systems",
      url: "/repotsystem",
      icon: "fa-solid fa-comments-question",
      permissions: [],
    },

    {
      title: "Digital Marketing",
      url: "",
      icon: "",
      permissions: [],
    },
    {
      title: "Blogs",
      url: "/blogs",
      icon: "fa-solid fa-comments-question",
      permissions: [],
    },

    // {
    //   title: 'Students',
    //   url: '/subscribers',
    //   icon: 'fa-solid fa-user-plus',
    //   permissions: [],
    // },

    // {
    //   title: 'Pre-Application',
    //   url: '/manualanswer',
    //   icon: 'fa-solid fa-user',
    //   permissions: [],
    // },
    // {
    //   title: 'Pre-Application',
    //   url: '/pre-application',
    //   icon: 'fa-solid fa-user',
    //   permissions: [],
    // },

    // {
    //   title: 'Ticket List',
    //   url: '/ticketlist',
    //   icon: 'fa-solid fa-user',
    //   permissions: [],
    // },

    // {
    //   title: 'Coupon Management',
    //   url: '',
    //   icon: 'fa-solid fa-comments-question',
    //   permissions: [],
    // },
    // {
    //   title: 'Review Dashboard',
    //   url: '/review/dashboard',
    //   icon: 'fa-solid fa-comments-question',
    //   permissions: [],
    // },
    // {
    //   title: 'Organization Users',
    //   url: '/review/user',
    //   icon: 'fa-solid fa-comments-question',
    //   permissions: [],
    // },
    // {
    //   title: "Review Q&A",
    //   url: "",
    //   icon: "fa-solid fa-user",
    //   permissions: [],
    //   children: [
    //     {
    //       title: "Pre Application",
    //       url: "/review/module/1",
    //       icon: '',
    //       permissions: [],
    //     },
    //     {
    //       title: "Post Application",
    //       url: "/review/module/2",
    //       icon: '',
    //       permissions: [],
    //     },
    //     {
    //       title: "Post Addmission",
    //       url: "review/module/3",
    //       icon: "",
    //       permissions: [],
    //     },
    //     {
    //       title: "Career Hub",
    //       url: "review/module/4",
    //       icon: "",
    //       permissions: [],
    //     },
    //     {
    //       title: "University",
    //       url: "review/module/5",
    //       icon: "",
    //       permissions: [],
    //     },
    //     {
    //       title: "Life At",
    //       url: "review/module/6",
    //       icon: "",
    //       permissions: [],
    //     },
    //   ]
    // },
    // {
    //   title: 'Q&A Add Request',
    //   url: '/review/addquestion',
    //   icon: 'fa-solid fa-comments-question',
    //   permissions: [],
    // },

    // {
    //   title: 'Marketing Management',
    //   url: '/addpartner',
    //   icon: 'fa-solid fa-user-graduate',
    //   permissions: [],
    // },
    // {
    //   title: "College Management",
    //   url: "/addcolleges",
    //   icon: "fa-solid fa-user",
    //   permissions: [],
    //   children: [
    //     {
    //       title: "Bulk College List",
    //       url: "",
    //       icon: "",
    //       permissions: [],
    //     },
    //     {
    //       title: 'College Users',
    //       url: '/addcolleges',
    //       icon: '',
    //       permissions: [],
    //     },
    //   ]
    // },
    {
      title: "Data Management",
      url: "/countrymanagement",
      icon: "fa-solid fa-user",
      permissions: [],
      children: [
        {
          title: "Investor List",
          url: "/investor",
          icon: "",
          permissions: [],
        },
        {
          title: "Company List",
          url: "/company",
          icon: "",
          permissions: [],
        },
        {
          title: "Pitch Deck",
          url: "/pitch-deck",
          icon: "",
          permissions: [],
        },
        {
          title: "Uni Finder",
          url: "/course-list",
          icon: "",
          permissions: [],
        },
        {
          title: "Career Planner",
          url: "/career-planner",
          icon: "",
          permissions: [],
        },
        {
          title: "Startup Kit",
          url: "/startup",
          icon: "",
          permissions: [],
        },

        {
          title: "Countries",
          url: "/countrymanagement",
          icon: "",
          permissions: [],
        },
        {
          title: "Scholarship List",
          url: "/scholarshipmanagement",
          icon: "",
          permissions: [],
        },
        {
          title: "Resources",
          url: "/resources",
          icon: "",
          permissions: [],
        },

        {
          title: "Events",
          url: "/events",
          icon: "",
          permissions: [],
        },
        {
          title: "Registered Event Users",
          url: "/registereventuser",
          icon: "",
          permissions: [],
        },

        {
          title: "Tutorials",
          url: "/addtutorial",
          icon: "",
          permissions: [],
        },
        {
          title: "Success Stories",
          url: "/addstory",
          icon: "",
          permissions: [],
        },
        {
          title: "FAQ Categories",
          url: "/data/faq-cat",
          icon: "",
          permissions: [],
        },
        {
          title: "FAQ Queries",
          url: "/data/faq",
          icon: "",
          permissions: [],
        },
        {
          title: "Help & Support Categories",
          url: "/data/help-cat",
          icon: "",
          permissions: [],
        },
        {
          title: "Help & Support Queries",
          url: "/data/help",
          icon: "",
          permissions: [],
        },
      ],
    },
    {
      title: "Landing Page",
      url: "/landing-page",
      icon: "fa-solid fa-user-graduate",
      permissions: [],
    },
    {
      title: "Our Management",
      url: "/management",
      icon: "fa-solid fa-users",
      permissions: [],
    },
    {
      title: "Prompt Editor",
      url: "/prompt-editor",
      icon: "fa-solid fa-microchip",
      permissions: [],
    },
  ];
  userPermissions: string[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        })
      )
      .subscribe({
        next: () => {
          this.markCurrentMenu();
        },
      });
  }

  ngOnInit(): void {
    this.loadSideMenu();
    this.markCurrentMenu();
  }

  loadSideMenu() {
    this.userPermissions = this.authService.userPermissions;
    const userRole = this.userPermissions[0];
    let userArray: any[] = [];

    switch (userRole) {
      case "User": {
        userArray = adminUser;
        break;
      }
      case "Admin": {
        userArray = subAdmin;
        break;
      }
      case "MarketingRepresentative": {
        userArray = marketingRepresentativeUser;
        break;
      }
      case "EmployeeUser": {
        userArray = employeeUser;
        break;
      }
      case "FreelancerUser": {
        userArray = freelancerUser;
        break;
      }
      case "InformationReviewUser": {
        userArray = informationReviewUser;
        break;
      }
      case "StaffUser": {
        userArray = staffUser;
        break;
      }
      case "College User": {
        userArray = collegeUser;
        break;
      }
      case "College Student User": {
        userArray = collegeStudentUser;
        break;
      }
      case "DirectStudentUser": {
        userArray = directStudentUser;
        break;
      }
    }

    // this.menus = this.menus.map((item: SideMenu) => ({ ...item, permissions: userArray.includes(item.title) ? [userRole] : [] }));
    this.menus = this.menus.map((item: SideMenu) => ({
      ...item,
      permissions: [userRole],
    }));
  }

  markCurrentMenu() {
    const path = this.router.url.split("?")[0];
    const paramtersLen = Object.keys(
      this.activatedRoute.snapshot.params
    ).length;
    const pathArr = path
      .split("/")
      .slice(0, path.split("/").length - paramtersLen);
    const url = pathArr.join("/");
    this.menus.forEach((menu) => {
      if (url.includes(menu.url || "**") && menu.url != "/") {
        menu.active = true;
        this.active.emit(menu);
      } else if (menu.url == url) {
        menu.active = true;
        this.active.emit(menu);
      } else {
        if (menu.children && menu.children?.length > 0) {
          menu.children.forEach((cmenu) => {
            if (url.includes(cmenu.url || "**")) {
              cmenu.active = true;
              menu.active = true;
              this.active.emit(cmenu);
            } else {
              cmenu.active = false;
              menu.active = false;
            }
          });
        } else {
          menu.active = false;
        }
      }
    });
    this.authService.getUserDetails$
      .pipe(filter((user) => !!user)) // only pass non-null values
      .subscribe((res) => {
        // alert(res.usertype_id);
        if (res[0].usertype_id == 7) {
          this.menus = this.menus.filter(
            (menuItem) =>
              menuItem.title != "Q & A" &&
              menuItem.title != "DashBoard" &&
              menuItem.title != "Subscription" &&
              menuItem.title != "Subscribers" &&
              menuItem.title != "Ticket List" &&
              menuItem.title != "Q&A Report" &&
              menuItem.title != "Chat" &&
              menuItem.title != "Support Chat" &&
              menuItem.title != "Country Management" &&
              menuItem.title != "College Users" &&
              menuItem.title != "Partner Users" &&
              menuItem.title != "Help & Support Categories" &&
              menuItem.title != "Help & Support" &&
              menuItem.title != "FAQ Categories" &&
              menuItem.title != "FAQ" &&
              menuItem.title != "Resources" &&
              menuItem.title != "College Management" &&
              menuItem.title != "Marketing Management" &&
              menuItem.title != "Data Management" &&
              menuItem.title != "Coupon Management" &&
              menuItem.title != "Q&A Add Request" &&
              menuItem.title != "Review Q&A" &&
              menuItem.title != "Organization Users" &&
              menuItem.title != "Review Dashboard" &&
              menuItem.title != "Review Users" &&
              menuItem.title != "Reading" &&
              menuItem.title != "My Coupon"
            // menuItem.children.find((n)=>n.title != "Assign Institutions")
            // menuItem.title != menuItem.children.title
          );
          this.menus.forEach((menu, index) => {
            if (menu.title == "Users Management") {
              this.menus[index].children.splice(1, 2);
            }
          });
        } else if (res[0].usertype_id == 10) {
          this.menus = this.menus.filter(
            (menuItem) =>
              menuItem.title != "DashBoard" &&
              menuItem.title != "Subscription" &&
              menuItem.title != "Subscribers" &&
              menuItem.title != "Ticket List" &&
              menuItem.title != "Q&A Report" &&
              menuItem.title != "Chat" &&
              menuItem.title != "Support Chat" &&
              menuItem.title != "Country Management" &&
              menuItem.title != "College Users" &&
              menuItem.title != "Partner Users" &&
              menuItem.title != "Help & Support Categories" &&
              menuItem.title != "Help & Support" &&
              menuItem.title != "FAQ Categories" &&
              menuItem.title != "FAQ" &&
              menuItem.title != "Resources" &&
              menuItem.title != "Users" &&
              menuItem.title != "Data Management" &&
              menuItem.title != "College Management" &&
              menuItem.title != "Marketing Management" &&
              menuItem.title != "Credit Sheet" &&
              menuItem.title != "Coupon Management"
          );
        } else if (res[0].usertype_id == 3) {
          this.menus = this.menus.filter(
            (menuItem) =>
              menuItem.title != "DashBoard" &&
              menuItem.title != "Subscription" &&
              menuItem.title != "Subscribers" &&
              menuItem.title != "Ticket List" &&
              menuItem.title != "Q&A Report" &&
              menuItem.title != "Chat" &&
              menuItem.title != "Support Chat" &&
              menuItem.title != "Country Management" &&
              menuItem.title != "College Users" &&
              menuItem.title != "Partner Users" &&
              menuItem.title != "Help & Support Categories" &&
              menuItem.title != "Help & Support" &&
              menuItem.title != "FAQ Categories" &&
              menuItem.title != "FAQ" &&
              menuItem.title != "Resources" &&
              menuItem.title != "Lead Dashboard" &&
              menuItem.title != "Credit Sheet" &&
              menuItem.title != "Students" &&
              menuItem.title != "Q & A" &&
              menuItem.title != "Marketing Management" &&
              menuItem.title != "College Management" &&
              menuItem.title != "Data Management" &&
              menuItem.title != "Pre Application" &&
              menuItem.title != "Review Users" &&
              menuItem.title != "Users Management" &&
              menuItem.title != "Revenue Dashboard" &&
              menuItem.title != "Coupon Management" &&
              menuItem.title != "Users" &&
              menuItem.title != "Q&A Add Request" &&
              menuItem.title != "My Coupon"
          );
        } else if (res[0].usertype_id == 9) {
          this.menus = this.menus.filter(
            (menuItem) =>
              menuItem.title != "Q & A" &&
              menuItem.title != "Revenue Dashboard" &&
              menuItem.title != "Review Dashboard" &&
              menuItem.title != "DashBoard" &&
              menuItem.title != "DashBoard" &&
              menuItem.title != "Subscription" &&
              menuItem.title != "Subscribers" &&
              menuItem.title != "Ticket List" &&
              menuItem.title != "Q&A Report" &&
              menuItem.title != "Chat" &&
              menuItem.title != "Support Chat" &&
              menuItem.title != "Country Management" &&
              menuItem.title != "College Users" &&
              menuItem.title != "Partner Users" &&
              menuItem.title != "Help & Support Categories" &&
              menuItem.title != "Help & Support" &&
              menuItem.title != "FAQ Categories" &&
              menuItem.title != "FAQ" &&
              menuItem.title != "Resources" &&
              menuItem.title != "Marketing Management" &&
              menuItem.title != "Data Management" &&
              menuItem.title != "Coupon Management" &&
              menuItem.title != "Q&A Add Request" &&
              menuItem.title != "Review Q&A" &&
              menuItem.title != "Organization Users" &&
              menuItem.title != "Review Dashboard" &&
              menuItem.title != "Review Users" &&
              menuItem.title != "Reading"
          );
        } else if (res[0].usertype_id == 2) {
          this.menus = this.menus.filter(
            (menuItem) =>
              menuItem.title != "Review Dashboard" &&
              menuItem.title != "Review Q&A" &&
              menuItem.title != "Organization Users" &&
              menuItem.title != "College Management" &&
              menuItem.title != "Ticket List" &&
              menuItem.title != "Support Chat" &&
              menuItem.title != "My Coupon"
          );
        } else if (res[0].usertype_id == 12) {
          this.menus = this.menus.filter(
            (menuItem) =>
              menuItem.title != "Q & A" &&
              menuItem.title != "Review Dashboard" &&
              menuItem.title != "DashBoard" &&
              menuItem.title != "Subscription" &&
              menuItem.title != "Subscribers" &&
              menuItem.title != "Ticket List" &&
              menuItem.title != "Q&A Report" &&
              menuItem.title != "Chat" &&
              menuItem.title != "Support Chat" &&
              menuItem.title != "Country Management" &&
              menuItem.title != "College Users" &&
              menuItem.title != "Partner Users" &&
              menuItem.title != "Help & Support Categories" &&
              menuItem.title != "Help & Support" &&
              menuItem.title != "FAQ Categories" &&
              menuItem.title != "FAQ" &&
              menuItem.title != "Resources" &&
              menuItem.title != "Revenue Dashboard" &&
              menuItem.title != "Marketing Management" &&
              menuItem.title != "Data Management" &&
              menuItem.title != "Coupon Management" &&
              menuItem.title != "Q&A Add Request" &&
              menuItem.title != "Review Q&A" &&
              menuItem.title != "Organization Users" &&
              menuItem.title != "Review Dashboard" &&
              menuItem.title != "Review Users" &&
              menuItem.title != "Reading"
          );
        } else if (res[0].usertype_id == 13) {
          this.menus = this.menus.filter(
            (menuItem) =>
              menuItem.title != "Q & A" &&
              menuItem.title != "Review Dashboard" &&
              menuItem.title != "DashBoard" &&
              menuItem.title != "Subscription" &&
              menuItem.title != "Subscribers" &&
              menuItem.title != "Ticket List" &&
              menuItem.title != "Q&A Report" &&
              menuItem.title != "Chat" &&
              menuItem.title != "Support Chat" &&
              menuItem.title != "Country Management" &&
              menuItem.title != "College Users" &&
              menuItem.title != "Partner Users" &&
              menuItem.title != "Help & Support Categories" &&
              menuItem.title != "Help & Support" &&
              menuItem.title != "FAQ Categories" &&
              menuItem.title != "Revenue Dashboard" &&
              menuItem.title != "FAQ" &&
              menuItem.title != "Resources" &&
              menuItem.title != "Marketing Management" &&
              menuItem.title != "Data Management" &&
              menuItem.title != "Coupon Management" &&
              menuItem.title != "Q&A Add Request" &&
              menuItem.title != "Review Q&A" &&
              menuItem.title != "Organization Users" &&
              menuItem.title != "Review Dashboard" &&
              menuItem.title != "Review Users" &&
              menuItem.title != "Reading"
          );
        } else if (res[0].usertype_id == 14) {
          this.menus = this.menus.filter(
            (menuItem) =>
              menuItem.title != "Q & A" &&
              menuItem.title != "Review Dashboard" &&
              menuItem.title != "DashBoard" &&
              menuItem.title != "Subscription" &&
              menuItem.title != "Subscribers" &&
              menuItem.title != "Ticket List" &&
              menuItem.title != "Q&A Report" &&
              menuItem.title != "Chat" &&
              menuItem.title != "Support Chat" &&
              menuItem.title != "Country Management" &&
              menuItem.title != "College Users" &&
              menuItem.title != "Partner Users" &&
              menuItem.title != "Help & Support Categories" &&
              menuItem.title != "Help & Support" &&
              menuItem.title != "FAQ Categories" &&
              menuItem.title != "Revenue Dashboard" &&
              menuItem.title != "FAQ" &&
              menuItem.title != "Resources" &&
              menuItem.title != "Marketing Management" &&
              menuItem.title != "Data Management" &&
              menuItem.title != "Coupon Management" &&
              menuItem.title != "Q&A Add Request" &&
              menuItem.title != "Review Q&A" &&
              menuItem.title != "Organization Users" &&
              menuItem.title != "Review Dashboard" &&
              menuItem.title != "Review Users" &&
              menuItem.title != "Reading"
          );
        }
      });
  }
  // markCurrentMenu1() {
  //   const path = this.router.url.split('?')[0];
  //   const paramtersLen = Object.keys(this.activatedRoute.snapshot.params).length;
  //   const pathArr = path.split('/').slice(0, path.split('/').length - paramtersLen);
  //   const url = pathArr.join('/');
  //   this.menu.forEach(menu => {
  //     if (url.includes(menu.url || '**') && menu.url != '/') {
  //       menu.active = true;
  //       this.active.emit(menu);
  //     } else if (menu.url == url) {
  //       menu.active = true;
  //       this.active.emit(menu);
  //     } else {
  //       if (menu.children && menu.children?.length > 0) {
  //         menu.children.forEach(cmenu => {
  //           if (url.includes(cmenu.url || '**')) {
  //             cmenu.active = true;
  //             menu.active = true;
  //             this.active.emit(cmenu);
  //           } else {
  //             cmenu.active = false;
  //             menu.active = false;
  //           }
  //         });
  //       } else {
  //         menu.active = false;
  //       }
  //     }
  //   });
  // }

  onexpand(item: SideMenu) {
    if (item.header) {
      return;
    }
    if (item.expanded) {
      item.expanded = !item.expanded;
      return;
    }
    if (item.children) {
      if (item.children.length > 0) {
        item.expanded = true;
      } else {
        item.expanded = false;
      }
    } else {
      this.router.navigateByUrl(item.url || "/");
    }
  }
  isCategory(item: any): boolean {
    return [
      "Revenue System",
      "Core System",
      "User System",
      "Marketing System",
      "Review System",
      "Report System",
      "Data System",
      "Digital Marketing",
    ].includes(item.title);
  }

  toggleExpand(item: any, event: Event) {
    event.stopPropagation(); // prevent accidental dismiss
    item.expanded = !item.expanded;
  }
}
