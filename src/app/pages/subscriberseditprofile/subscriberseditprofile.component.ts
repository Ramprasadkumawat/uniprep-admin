import {Component,ElementRef,Input,OnInit,ViewChild} from "@angular/core";
import {CommonModule,DatePipe} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {ConfirmationService,MessageService} from "primeng/api";
import {TabsModule} from 'primeng/tabs';
import {InputNumberModule} from "primeng/inputnumber";
import {TableModule} from "primeng/table";
import {AccordionModule} from "primeng/accordion";
import {SelectModule} from "primeng/select";
import {TextareaModule} from "primeng/textarea";
import {filter,Observable} from "rxjs";
import {FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators,} from "@angular/forms";
import {ActivatedRoute,Router} from "@angular/router";
import {UserFacadeService} from "../users/user-facade.service";
import {PageFacadeService} from "../page-facade.service";
import {SubscriptionService} from "../subscription/subscription.service";
import {SubscriptionPlan} from "src/app/@Models/subscription";
import {DatePickerModule} from 'primeng/datepicker';
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {SubscriberService} from "../subscribers/subscriber.service";
import {MultiSelectModule} from "primeng/multiselect";
import {AuthService} from "src/app/Auth/auth.service";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {TooltipModule} from "primeng/tooltip";
import {PopoverModule} from 'primeng/popover';
import {ChipModule} from "primeng/chip";
import {EditorModule} from "primeng/editor";
import screenfull from "screenfull";
import {DomSanitizer,SafeHtml} from "@angular/platform-browser";
import {NgxIntlTelInputModule,SearchCountryField} from "ngx-intl-tel-input";
import {DialogModule} from "primeng/dialog";
import {CheckboxModule} from "primeng/checkbox";
import {MenuModule} from "primeng/menu";
import {MenuItem} from "primeng/api";
import {LocationService} from "src/app/location.service";
import {CompaniesService} from "../companies/companies.service";
import {JobsService} from "../jobs/jobs.service";

@Component({
    selector: "uni-subscriberseditprofile",
    templateUrl: "./subscriberseditprofile.component.html",
    styleUrls: ["./subscriberseditprofile.component.scss"],
    imports: [CommonModule,InputTextModule,InputNumberModule,TabsModule,TableModule,AccordionModule,SelectModule,TextareaModule,ReactiveFormsModule,DatePickerModule,CardModule,ButtonModule,MultiSelectModule,ConfirmPopupModule,TooltipModule,PopoverModule,ChipModule,EditorModule,FormsModule,NgxIntlTelInputModule,DialogModule,CheckboxModule,MenuModule],
    providers: [ConfirmationService]
})
export class SubscriberseditprofileComponent implements OnInit {
    @Input() editingCompanyId: number | null = null;
    @Input() companyDataToEdit: any = null;
    @Input() maxYear: Date = new Date();
    editform: FormGroup;
    showPaymentDialog = false;
    remarksForm: FormGroup;
    page: number = 1;
    pageSize = 10;
    payments: any[] = [];
    statusOptions = [
        {value: 1,label: "Active"},
        {value: 0,label: "InActive"},
    ];
    genderoption = [
        {name: "Select",code: null},
        {name: "Male",code: "M"},
        {name: "Female",code: "F"},
        {name: "Others",code: "O"},
    ];
    users: any[] = [];
    submitted = false;
    subscriberObj: object = {};
    subscriberId!: number;
    subscriptions$!: Observable<SubscriptionPlan[]>;
    subscriptions: any = [];
    subscriptionStatus: any = [{id: 0,value: 'Active'},{id: 1,value: 'Unsubscribed-Active'},{id: 2,value: 'Unsubscribed-Expired'},{id: 3,value: 'Exhausted'}];
    programLevels: any = [];
    countries: any = [];
    StudentList: any = [];
    EnterpriseSubscription: any = [];
    credits: any = [];
    today = new Date();
    subscriberTransaction: any = [];
    usagetrackinglist: any = [];
    userDocument: any = {aadhar: {front: null,back: null},pan: {front: null,back: null},education: [],payslip: [],experience: [],other: []};
    usageTrackingHoursCount: any
    subscriberTransactionCount: any = [];
    preApplicationKeys: string[] = [];
    preApplicationData: any;
    postApplicationKeys: string[] = [];
    postApplicationData: any;
    readingProgressioncount: number = 0;
    quizProgressions: any = [];
    quizProgressionCount: number = 0;
    postAdmissionData: any;
    postAdmissionKeys: string[] = [];
    universityData: any;
    universityKeys: string[] = [];
    careerHubData: any;
    careerHubKeys: string[] = [];
    lifeAtData: any;
    lifeAtKeys: string[] = [];
    currentDate = new Date();
    selectedDate = new Date();
    dateTime = new Date();
    maximumTime = new Date();
    EditOrUpdate: string = "Edit"
    isEdit: boolean = true;
    currentUserId!: number;
    isReadonly: boolean = true;
    unread: any;
    read: any;
    total: any;
    subList: any;
    generatedLink: string | null = null;
    @ViewChild('content',{static: false}) contentElement: ElementRef;
    expanded: boolean = false;
    fullscreen = "";
    @ViewChild("fullscreeneditor") editorelement: ElementRef;
    @ViewChild('dtPayment') tablePayment: any;
    modules = {};
    sendmessageLoading: boolean = false;
    visibility = false;
    remarkList: any[] = []
    customSourceName: string = "Source Name";
    sourceTypes: any = [];
    sourceName: any = [];
    sourceNameTwo: any = [];
    currencyList: any[] = [];
    breadcrumbsname = "Edit Profile"
    superadmindeleteoption: boolean = false;
    usertypid: boolean = true;
    usertype: number = 0;
    isCollegeSelected: boolean = false;
    currentSpecializationList: any = [];
    currentFirstPayment: number = 0;
    currentSortFieldPayment: string | null = null;
    currentPage = 1;
    currentSortOrderPayment: number = 1;
    SearchCountryField = SearchCountryField;
    preferredCountry: any;
    isShowCheckbox: boolean = false;
    isCheckBixClickOrNotClick: boolean = false;
    check_subscription_id: any;
    coBranding: any[] = [
        {value: 1,label: 'Yes'},
        {value: 0,label: 'No'},
    ];
    remarkForm: FormGroup = new FormGroup({});
    paymentForm = this.fb.group({
        currency: ['',Validators.required],
        total_amount: ['',Validators.required],
        description: ['',Validators.required],
    });
    isAddRemark: boolean = false;
    remarkSubmitted: boolean = false;
    remarksStatusList: {label: string,value: string}[] = [
        {label: 'Very Happy',value: 'Very Happy'},
        {label: 'Happy',value: 'Happy'},
        {label: 'Neutral',value: 'Neutral'},
        {label: 'Unhappy',value: 'Unhappy'},
        {label: 'Not Interested',value: "Not Interested"},
        {label: 'Busy',value: "Busy"},
    ];
    followUpList: {id: number,value: string}[] = [
        {id: 1,value: 'Yes'},
        {id: 0,value: 'No'},
    ];
    isFollupDetails: boolean = false;
    invitesList: any[] = [];
    studentId: any;
    locationListFilter: any[] = [];
    homeCountries = [];
    constructor(
        private userFacade: UserFacadeService,
        private router: Router,
        private companyService: CompaniesService,
        private jobsService: JobsService,
        private toast: MessageService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private pageService: PageFacadeService,
        private subscriptionService: SubscriptionService,
        private subscriberService: SubscriberService,
        private authService: AuthService,
        private toaster: MessageService,
        private confirmationService: ConfirmationService,
        private sanitizer: DomSanitizer,
        private datePipe: DatePipe,
        private locationService: LocationService
    ){
        this.modules = {
            toolbar: {
                container: [
                    ["bold","italic","underline","strike"],
                    ["blockquote","code-block"],
                    [{header: 1 },{header: 2 }],
                    [{list: "ordered" },{list: "bullet"}],
                    [{script: "sub" },{script: "super"}],
                    [{indent: "-1" },{indent: "+1"}],
                    [{direction: "rtl"}],
                    [{header: [1,2,3,4,5,6,false]}],
                    [{color: []},{background: []}],
                    [{align: []}],
                    ["clean"],
                ],
                handlers: {
                    emoji: function(){},
                    attachmentHandler: () => {
                        this.visibility = !this.visibility;
                    },
                    fullscreen: () => {
                        if(screenfull.isEnabled){
                            this.fullscreen = this.fullscreen ? "" : "fullscreen";
                            screenfull.toggle(this.editorelement.nativeElement);
                        }
                    },
                },
            },
        };
        this.editform = fb.group({
            name: ["",[Validators.required]],
            email: ["",[Validators.required,Validators.email]],
            phone: [""],
            student_type: [""],
            enterprise_subscription: [""],
            gender: [""],
            subscription_id: [null],
            subscription_Status: [null],
            location_id: ["",[Validators.required]],
            country_id: ["",[Validators.required]],
            interested_country_id: [""],
            last_degree_passing_year: [""],
            intake_year_looking: [''],
            intake_month_looking: [''],
            programlevel_id: ["",[Validators.required]],
            credit_plans: [null],
            source_type: [''],
            source_name: [''],
            source_name_two: [''],
            current_specialization_id: [null],
            source_job: [''],
            talent_id: [""],
        });
        this.remarksForm = this.fb.group({
            status: [''],
            followUp: [0],
            followUpDate: [''],
            followUpTime: [''],
            remarks: [''],
            rnr: [0]
        });
    }
    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get("id");
        this.studentId = id
        this.subscriberObj = {userid: id};
        this.getSubscribers();
        this.getHomeCountryList();
        this.remarksForm.get('followUpTime')?.disable();
        this.remarksForm.get('followUpDate')?.disable();
        this.initializePhoneNo();
        this.getCountryList();
        this.getMe();
        this.getProgramLevelList();
        this.getUserDocuments();
        this.getCreditsList();
        this.getStudentTypeList();
        this.getEnterpriseCollegeList();
        this.getInviteList(id);
        let subscriberQuizObj = {page: "1",perpage: "20",userid: id};
        this.getSubscribersTransactionList(subscriberQuizObj);
        this.getUsageTrackingList()
        this.dateTime.setDate(this.dateTime.getDate());
        this.getRemarksList();
        this.loadPaymentDropdowns();
        this.expandedCards = new Array(this.remarkList.length).fill(false);
        this.usertype = Number(localStorage.getItem("usertypeidforeditprofile"));
        if(this.usertype == 7){
            this.usertypid = false;
        }else{
            this.usertypid = true;
        }
    }
    private loadPaymentDropdowns(): void {
        this.jobsService.getDropdownData().subscribe({
            next: (response: any) => {
                this.currencyList = response?.currencycode || [];
            },error: () => {
                this.currencyList = [];
            },
        });
    }
    get f(){
        return this.editform.controls;
    }
    getMe(){
        this.authService.getUserDetails$.pipe(filter(user => !!user)).subscribe(res => {
            this.currentUserId = res[0].usertype_id;
            if(this.currentUserId == 21){
                this.superadmindeleteoption = true;
            }
        });
    }
    getSourceTypeList(student_type_id: number){
        this.pageService.getSourceTypes(student_type_id).subscribe((response) => {
            this.sourceTypes = [{id: null,name: "Select" },...response];
        });
    }
    changeSourceName(){
        const source_type_id = this.editform.value.source_type;
        const source_id = this.editform.value.source_name;
        this.pageService.getSourceNameTwo(source_type_id,source_id).subscribe((response) => {
            this.sourceNameTwo = [{id: null,source_name: "Select" },...response];
        });
    }
    checkWhatsUpOrPhone: number = 0;
    getSubscribers(){
        this.subscriberObj = {userid: this.studentId};
        this.subscriberService.getEditSubscribers(this.subscriberObj).subscribe((response: any) => {
            this.users = response.data;
            if(this.users.length > 0){
                this.getSourceTypeList(this.users[0].source_type);
                let subscription_plan_status = ""
                if(this.users[0].subscriptionplan == "Free" && this.users[0].subscriptionplanstatus == "Active"){
                    subscription_plan_status = "Unsubscribed-Active"
                }
                if(this.users[0].subscriptionplan == "Free" && this.users[0].subscriptionplanstatus != "Active"){
                    subscription_plan_status = "Unsubscribed-Expired"
                }
                this.editform.patchValue({
                    name: this.users[0].username,
                    email: this.users[0].useremail,
                    phone: this.users[0].whatsapp_phone ? this.users[0].whatsapp_phone : this.users[0].userphone,
                    student_type: this.users[0].student_type_id,
                    gender: this.users[0].gender,
                    subscription_id: this.users[0].subscription_plan_id,
                    subscription_Status: subscription_plan_status ? subscription_plan_status : this.users[0].subscriptionplanstatus,
                    country_id: this.users[0].home_country_id,
                    interested_country_id: Number(this.users[0].interested_country_id),
                    programlevel_id: this.users[0].programlevel_id,
                    last_degree_passing_year: this.users[0].lastdegreepassingyear,
                    credit_plans: this.users[0].chat_credits,
                    intake_year_looking: this.users[0]?.intakeyear,
                    intake_month_looking: this.users[0]?.intakemonth,
                    source_type: this.users[0]?.source_type,
                    current_specialization_id: this.users[0]?.current_specialization_id,
                    source_job: this.users[0]?.source_job,
                    talent_id: response.talent_id
                });
                this.checkWhatsUpOrPhone = this.users[0].whatsapp_phone ? 1 : 0;
                this.preferredCountry = this.users[0]?.phone_dial_country_code ? this.users[0]?.phone_dial_country_code : this.users[0]?.whatsapp_dial_country_code;
                let data = {
                    value: this.users[0].source_type
                }
                this.changeCountryFilter()
                this.changeSourceType(data,this.users[0]?.current_specialization_id);
                setTimeout(() => {
                    this.editform.patchValue({source_name: this.users[0]?.source});
                },300);
                this.selectedDate.setFullYear(this.editform.get('intake_year_looking')?.value);
                this.selectedDate.setMonth(this.editform.get('intake_month_looking')?.value - 1);
                this.editform.get('intake_month_looking')?.value ? this.editform.get('intake_month_looking')?.setValue(this.selectedDate) : '';
                var selectedYear = this.editform.get('intake_year_looking')?.value;
                this.maximumTime.setFullYear(selectedYear);
                this.maximumTime.setMonth(11);
                if(this.currentDate.getFullYear() != selectedYear){
                    this.dateTime = new Date(selectedYear,0,1);
                }else{
                    this.dateTime.setFullYear(selectedYear);
                }
                if(this.users[0].subscription_id){
                    this.editform.controls["subscription_id"].setValidators(Validators.required);
                    this.editform.controls["subscription_id"].updateValueAndValidity();
                    this.editform.controls["credit_plans"].setValidators(Validators.required);
                    this.editform.controls["credit_plans"].updateValueAndValidity();
                }else{
                    this.editform.controls["subscription_id"].setErrors(null);
                    this.editform.get("subscription_id").clearValidators();
                    this.editform.controls["subscription_id"].updateValueAndValidity();
                    this.editform.controls["credit_plans"].setErrors(null);
                    this.editform.get("credit_plans").clearValidators();
                    this.editform.controls["credit_plans"].updateValueAndValidity();
                }
                this.loadSubscriptions();
                this.check_subscription_id = this.users[0].subscription_plan_id;
            }
        });
    }
    loadSubscriptions(){
        this.subscriptionService.getSubscriptionDropdownList({studenttype: this.users[0].student_type_id }).subscribe((response) => {
            this.subscriptions = response.subscriptions.map((sub: SubscriptionPlan) => ({id: sub.id,subscription: sub.subscription_plan}));
            this.subscriptions = [{id: null,subscription: "Select"},...this.subscriptions];
            var subs = {id: ""};
            this.subscriptions.forEach((data) => {
                if(data.subscription == this.users[0]?.subscription_plan){
                    subs.id = data.id;
                }
            });
        });
    }
    getStudentTypeList(){
        this.pageService.getStudentType().subscribe((response) => {
            this.StudentList = [{id: null,subtypeName: "Select"},...response];
        });
    }
    getEnterpriseCollegeList(){
        this.pageService.getEnterpriseCollegeList().subscribe((response) => {
            if(response) this.EnterpriseSubscription = [{id: null,institutename: "Select"},...response];
        });
    }
    getCountryList(){
        this.pageService.getCountries().subscribe((response) => {
            this.countries = [{id: null,country: "Select"},...response];
        });
    }
    getProgramLevelList(){
        this.pageService.getProgaramLevels().subscribe((response) => {
            this.programLevels = [{id: null,programlevel: "Select"},...response];
        });
    }
    getCreditsList(){
        this.pageService.getCredits().subscribe((response) => {
        this.credits = [{id: null,name: "Select"},...response.questioncredits];
        });
    }
    submitForm(){
        if(this.EditOrUpdate == 'Edit'){
            if(this.users[0].subscriptionplanstatus == "Exhausted" || this.users[0].subscriptionplanstatus == "Expired"){
                if(this.users[0].subscription_plan_id >= 1 && this.users[0].subscription_plan_id <= 6){
                    this.isShowCheckbox = false;
                }else{
                    this.isShowCheckbox = true;
                }
            }
            this.EditOrUpdate = "Update";
            this.isEdit = false;
            this.pageService.subscriptionChangePermission().subscribe((response) => {
                if(response.permission == 1){
                    this.isReadonly = false;
                }
            })
        }else{
            this.submitted = true;
            if(this.editform.invalid){
                return;
            }
            if(this.editform.value?.last_degree_passing_year == null){
                this.editform.value.last_degree_passing_year = "";
            }else if(typeof this.editform.value?.last_degree_passing_year == "string"){
                this.editform.value.last_degree_passing_year = this.editform.value?.last_degree_passing_year;
            }else {
                this.editform.value.last_degree_passing_year = this.editform.value?.last_degree_passing_year?.getFullYear();
            }
            if(this.editform.value?.intake_year_looking == null){
                this.editform.value.intake_year_looking = "";
            }else if(typeof this.editform.value?.intake_year_looking == "string"){
                this.editform.value.intake_year_looking = this.editform.value?.intake_year_looking
            }else{
                this.editform.value.intake_year_looking = this.editform.value?.intake_year_looking?.getFullYear();
            }
            if(this.editform.value?.intake_month_looking == null){
                this.editform.value.intake_month_looking = "";
            }else if(typeof this.editform.value?.intake_month_looking == "string"){
                this.editform.value.intake_month_looking = this.editform.value?.intake_month_looking;
            }else{
                if(typeof this.editform.value?.intake_month_looking == 'number'){
                    this.editform.value.intake_month_looking = this.editform.value?.intake_month_looking + 1;
                }else{
                    this.editform.value.intake_month_looking = this.editform.value?.intake_month_looking?.getMonth() + 1;
                }
            }
            this.editform.removeControl('subscription_Status');
            let data = {
                ...this.editform.value,
                userid: this.users[0].userid,
                subscription_plan: this.users[0].subscription_plan,
                whatsapp_number: this.checkWhatsUpOrPhone
            }
            if(this.editform?.value?.phone?.number == this.users[0].userphone){
            }else{
                data.phone_number = this.editform?.value?.phone?.number
            }
            if(this.isCheckBixClickOrNotClick){
                if(this.users[0].subscription_plan_id != this.editform.value?.subscription_id){
                    data.subscription_change = true;
                    if(this.editform.value?.subscription_id != 7 && this.editform.value?.subscription_id != 8){
                        data.subscription_pay_id = this.users[0].user_subscription_pay_id;
                    }
                }
            }else{
                if(this.users[0].subscriptionplanstatus == "Exhausted" || this.users[0].subscriptionplanstatus == "Expired"){
                    if(this.isCheckBixClickOrNotClick){
                    }else{
                        delete data.subscription_id;
                    }
                }else{
                    delete data.subscription_id;
                }
            }
            this.subscriberService.updateSubscriber(data).subscribe((response) => {
                this.submitted = false;
                this.editform.reset();
                this.toaster.add({severity: "success",summary: "Success",detail: "Student Details Updated Successfully" });
                this.router.navigate(["/subscribers"]);
            });
        }
    }
    getSubscribersTransactionList(data: object){
        this.subscriberService.getSubscribersTransactions(data).subscribe((response) => {
            this.subscriberTransaction = response;
            this.subscriberTransactionCount = this.subscriberTransaction.length;
        });
    }
    getUserDocuments(){
        const data = {user_id: this.route.snapshot.paramMap.get("id")};
        this.subscriberService.getUserDocuments(data).subscribe((response) => {
            this.userDocument = response?.files || this.userDocument;
        });
    }
    onDocsWalletTabClick(){
        this.getUserDocuments();
    }
    getUsageTrackingList(){
        let data = {user_id: this.route.snapshot.paramMap.get("id")}
        this.subscriberService.getUsageTracking(data).subscribe((response) => {
            this.usagetrackinglist = response.data;
            this.usageTrackingHoursCount = response.count;
        });
    }
    exportUsageTracking(){
        let data = {user_id: this.route.snapshot.paramMap.get("id")}
        this.subscriberService.usageTrackingExport(data).subscribe((response) => {
            window.open(response.link,'_blank');
        });
    }
    goBack(){
        this.router.navigate(["subscribers"]);
    }
    yearChage(event: any){
        this.editform.get('intake_month_looking')?.setValue('');
        let intakeYearValue = this.editform.get('intake_year_looking')?.value;
        let intakeYear = intakeYearValue.toString().split(' ')[3];
        this.maximumTime.setFullYear(intakeYear);
        this.maximumTime.setMonth(11);
        if(this.dateTime.getFullYear() != intakeYear && this.currentDate.getFullYear() != intakeYear){
            this.dateTime = new Date(intakeYear,0,1);
        }
        else {
            this.dateTime = new Date(intakeYear,this.currentDate.getMonth(),1);
        }
    }
    changePlan(event: any){
        let currentPlanId = event.value;
        let previousPlanId = this.users[0].subscription_plan_id
        if(this.users[0].subscriptionplanstatus == "Exhausted" || this.users[0].subscriptionplanstatus == "Expired"){
            if(this.users[0].subscription_plan_id == this.editform.value.subscription_id){
                if((currentPlanId == 1 || currentPlanId == 2 || currentPlanId == 3 || currentPlanId == 4 || currentPlanId == 5 || currentPlanId == 6)){
                    this.isShowCheckbox = false;
                    this.isCheckBixClickOrNotClick = false;
                }else{
                    this.isShowCheckbox = true;
                    this.isCheckBixClickOrNotClick = false;
                }
            }else{
                if((currentPlanId == 1 || currentPlanId == 2 || currentPlanId == 3 || currentPlanId == 4 || currentPlanId == 5 || currentPlanId == 6)){
                    this.isShowCheckbox = false;
                    this.isCheckBixClickOrNotClick = false;
                }else{
                    this.isShowCheckbox = false;
                    this.isCheckBixClickOrNotClick = true;
                }
            }
            if((currentPlanId == 7 || currentPlanId == 8 || currentPlanId == 9 || currentPlanId == 10 || currentPlanId == 11)){
                return;
            }
        }
        if((currentPlanId == 7 || currentPlanId == 8 || currentPlanId == 9 || currentPlanId == 10 || currentPlanId == 11) && (this.users[0].subscriptionplanstatus == "Active" || this.users[0].subscriptionplanstatus == "trail not started yet")){
            this.toaster.add({severity: "error",summary: "Restricted",detail: "You cannot select another free trial until current Free Trial has expired."});
            this.editform.get('subscription_id').setValue(previousPlanId);
            return;
        }
        if((currentPlanId >= 1 && currentPlanId <= 6) || (previousPlanId >= 1 || previousPlanId <= 6)){
            this.toaster.add({severity: "error",summary: "Restricted",detail: "You can't change the plan"});
            this.editform.get('subscription_id').setValue(previousPlanId);
        }
    }
    deletestudent(){
        var data = {user_id: this.users[0].userid}
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to delete this user?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.subscriberService.deleteStudent(data).subscribe(response => {
                    this.toaster.add({severity: 'success',summary: 'Success',detail: response.status });
                    this.router.navigate(["/subscribers"]);
                },error => {
                    this.toaster.add({severity: 'error',summary: 'Error',detail: error.message });
                });
            },reject: () => {
                this.toaster.add({severity: 'error',summary: 'Rejected',detail: 'You have rejected' });
            }
        });
    }
    expandedList: any[] = [];
    expandedCards: boolean[] = [];
    initialHeight: string = '1.5em';
    toggleExpand(index: number): void {
        this.expandedCards[index] = !this.expandedCards[index];
    }
    remarkscount: number = 0;
    getRemarksList(){
        let data = {user_id: this.route.snapshot.paramMap.get("id")}
        this.subscriberService.getRemarksList(data).subscribe({
            next: response => {
                this.remarkList = response.data;
                this.remarkscount = response.data.length;
            },error: err => {
                console.log(err?.error?.message)
            }
        });
    }
    changeStudentType(event: any){
        this.getSourceTypeList(event.value);
    }
    changeSourceType(event: any,specialization_id: string = null){
        this.isCollegeSelected = false;
        if(event.value == 2){
            this.isCollegeSelected = true;
            this.subscriberService.getcurrentspecialization().subscribe((response) => {
                this.currentSpecializationList = [{id: null,specialization_name: "Select"},...response];
                if(specialization_id){
                    this.editform.patchValue({current_specialization_id: specialization_id});
                }
            });
            this.editform.patchValue({student_type: 2});
            this.customSourceName = "Institution Name";
            let data: any = {source: event.value.toString()};
            if(this.editform.get('location_id').value !== 0){
                data.location_id = this.editform.get('location_id').value;
            }
            this.pageService.getSourceNameBySoucreId(data).subscribe((response) => {
                this.sourceName = [{id: null,institutename: "Select"},...response];
            });
            return;
        }else if(event.value == 11){
            this.customSourceName = "Company";
        }else if(event.value == 7 || event.value == 8){
            this.customSourceName = "Users";
        }else if(event.value == 4){
            this.customSourceName = "User";
        }else{
            this.customSourceName = "Source Name";
        }
        this.pageService.getSourceName(this.editform.value.source_type).subscribe((response) => {
            this.sourceName = [{id: null,source_name: "Select"},...response];
        });
    }
    getSanitizedHtml(message): SafeHtml {
        const strippedHtml = message.replace(/<\/?p[^>]*>/g,'');
        return strippedHtml
    }
    formatDateAndTime(timestamp: string): {formattedDate: string,formattedTime: string}{
        const dateObj = new Date(timestamp);
        const formattedDate = this.datePipe.transform(dateObj,'dd-MM-yyyy');
        const formattedTime = this.datePipe.transform(dateObj,'hh:mm a');
        return {formattedDate,formattedTime};
    }
    deleteData(id: any){
        this.confirmationService.confirm({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: "btn-primary",
            rejectButtonStyleClass: "btn-primary",
            accept: () => {
                this.subscriberService.deleteStudenRemarks({remarks_id: id}).subscribe((res) => {
                    this.toaster.add({severity: 'success',summary: 'Success',detail: 'Removed Successfully' });
                    this.ngOnInit()
                });
            }
        });
    }
    breedcrumbs(eve: any){
        this.breadcrumbsname
        const breadcrumbno = eve.index
        if(breadcrumbno == 1){
            this.breadcrumbsname = "Reading Progression"
        }else if(breadcrumbno == 2){
            this.breadcrumbsname = "Quiz Progression"
        }else if(breadcrumbno == 3){
            this.breadcrumbsname = "User Transactions"
        }else if(breadcrumbno == 4){
            this.breadcrumbsname = "Remarks"
        }else{
            this.breadcrumbsname = "Edit Profile"
        }
    }
    onChangeContact(event: any){
    }
    initializePhoneNo(){
        fetch('https://ipapi.co/json/').then(response => response.json()).then(data => {
            this.preferredCountry = data.country_code.toLocaleLowerCase()
        });
    }
    changePlanChecbox(event: any){
        this.isCheckBixClickOrNotClick = event.target.checked;
    }
    get rF(){
        return this.remarkForm.controls;
    }
    totalInviteListCount: number = 0;
    getInviteList(id){
        this.invitesList = [];
        var data = {sender_user_id: id}
        this.pageService.getInviteList(data).subscribe((response) => {
            this.invitesList = response.invites;
            this.totalInviteListCount = response.total_count
        });
    }
    submitFormRemarks(){
        if(this.remarksForm.value.rnr == 0){
            if(!this.remarksForm.value.status){
                this.toaster.add({severity: 'error',summary: 'Error',detail: "Please Select Status" });
                return
            }
        }
        if(this.remarksForm.value.followUp == 1){
            if(!this.remarksForm.value.followUpDate){
                this.toaster.add({severity: 'error',summary: 'Error',detail: "Please Select Follow Up Date" });
                return;
            }
            if(!this.remarksForm.value.followUpTime){
                this.toaster.add({severity: 'error',summary: 'Error',detail: "Please Select Follow Up Time" });
                return;
            }
        }
        if(!this.remarksForm.value.remarks){
            this.toaster.add({severity: 'error',summary: 'Error',detail: "Please Type Remarks" });
            return;
        }
        var data = {
            user_id: this.studentId,
            status_option: this.remarksForm.value.rnr ? this.remarksForm.value.rnr : this.remarksForm.value.status,
            follow_up: this.remarksForm.value.followUp,
            follow_date: this.remarksForm.value.followUpDate,
            follow_time: this.remarksForm.value.followUpTime ? this.convertTimeTo12HourFormat(this.remarksForm.value.followUpTime) : null,
            remarks: this.remarksForm.value.remarks,
        }
        this.subscriberService.getSumbitRemarks(data).subscribe((res) => {
            if(res){
                this.toaster.add({severity: 'success',summary: 'Success',detail: res.message });
                this.remarksForm.reset()
                this.isAddRemark = false
                this.getRemarksList();
                this.remarksForm.get('followUpTime')?.disable();
                this.remarksForm.get('followUpDate')?.disable();
                this.remarksForm.get('status')?.enable();
                this.remarksForm.patchValue({followUp: 0});
            }
        })
    }
    convertTimeTo12HourFormat(time: string): string {
        const [hour,minute] = time.split(':').map(Number);
        if(isNaN(hour) || isNaN(minute)){
            return '';
        }
        const date = new Date();
        date.setHours(hour,minute,0);
        const options: Intl.DateTimeFormatOptions = {hour: '2-digit',minute: '2-digit',second: '2-digit',hour12: true};
        return date.toLocaleTimeString('en-US',options);
    }
    onRnrChange(event: any): void {
        const isChecked = event.target.checked;
        this.remarksForm.patchValue({rnr: isChecked ? "RNR" : null });
        if(isChecked){
            this.remarksForm.get('status')?.disable();
        }else{
            this.remarksForm.get('status')?.enable();
        }
    }
    onFollowUpChange(event: any): void {
        const selectedValue = event.value;
        if(selectedValue === 1){
            this.remarksForm.get('followUpTime')?.enable();
            this.remarksForm.get('followUpDate')?.enable();
        }else{
            this.remarksForm.get('followUpTime')?.disable();
            this.remarksForm.get('followUpDate')?.disable();
        }
    }
    getStatusColor(status: string | null): string {
        switch (status){
            case 'Very Happy':
                return '#609923';
            case 'Happy':
                return '#8bc246';
            case 'Busy':
                return '#0054b4';
            case 'Neutral':
                return '#7e7e7e';
            case 'Unhappy':
                return '#f28b82';
            case 'Not Interested':
                return '#d93025';
            case 'RNR':
                return '#ff9800';
            default:
                return 'transparent';
        }
    }
    changeCountryFilter(){
        this.locationListFilter = [];
        const countryId = this.editform.get('country_id').value;
        if(countryId){
            var data = {country_id: countryId}
            this.locationService.getAllCountryLocation(data).subscribe((res: any) => {
                this.locationListFilter = res.data;
                this.editform.patchValue({
                    location_id: this.users[0].city_id
                })
            },(error: any) => {
                this.toaster.add({severity: "warning",summary: "Warning",detail: error.error.message});
            });
        }
    }
    getHomeCountryList(){
        this.subscriberService.getHomeCountry(2).subscribe((res: any) => {
            this.homeCountries = [{country: "Select",code: null},...res];
        },(error: any) => {
            this.toaster.add({severity: "warning",summary: "Warning",detail: error.error.message});
        });
    }
    onPageChangePayment(event: any){
        const isSortToggle =
        event.sortField === this.currentSortFieldPayment &&
        event.sortOrder !== this.currentSortOrderPayment &&
        event.first === 0 &&
        this.currentFirstPayment !== 0;
        if(isSortToggle){
            event.first = this.currentFirstPayment;
        }
        this.currentSortFieldPayment = event.sortField;
        this.currentSortOrderPayment = event.sortOrder;
        this.currentFirstPayment = event.first;
        this.currentPage= (event.first / event.rows) + 1;
        this.pageSize = event.rows;
        const params = {page: this.currentPage,perpage: this.pageSize,company_id: this.editingCompanyId};
        this.companyService.getPaymentInfo(params).subscribe({
            next: (res) => {
                if(res){
                    this.payments = res.data.payment_info || [];
                    if(this.currentSortFieldPayment){
                        this.payments.sort((a,b) => {
                            let aValue = a[this.currentSortFieldPayment!];
                            let bValue = b[this.currentSortFieldPayment!];
                            if(aValue == null) aValue = '';
                            if(bValue == null) bValue = '';
                            if(typeof aValue === 'string') aValue = aValue.toLowerCase();
                            if(typeof bValue === 'string') bValue = bValue.toLowerCase();
                            let result = 0;
                            if(aValue < bValue) result = -1;
                            else if(aValue > bValue) result = 1;
                            return this.currentSortOrderPayment * result;
                        });
                    }
                    if(isSortToggle && this.tablePayment){
                        setTimeout(() => {
                            this.tablePayment.first = this.currentFirstPayment;
                        },0);
                    }
                }
            },error: (err) => {
                console.error('Error on page change:',err);
            }
        });
    }
    generatePaymentLink(){
        if(this.paymentForm.invalid){
            this.paymentForm.markAllAsTouched();
            return;
        }
        this.generatedLink = null;
        const payload = {user_id: this.studentId,...this.paymentForm.value}
        this.subscriberService.generateUserCustomPaymentLink(payload).subscribe({
            next: (res: any) => {
                const paymentLink = res?.data?.payment_link || res?.payment_link || res?.data?.link || res?.link || "";
                this.generatedLink = paymentLink;
                if(res.message !== "Existing unpaid payment link"){
                    this.toast.add({severity: "success",summary: "Success",detail: "Payment saved successfully"});
                }
                if(res.message === "Existing unpaid payment link"){
                this.toast.add({severity: "warn",summary: "Warning",detail: "An existing unpaid payment link already exists for this company. Please use the existing link."});
                }
            },error: (err) => {
                this.generatedLink = "";
                this.toast.add({severity: "error",summary: "Error",detail: err?.error?.message || "Failed to generate payment link"});
            },
        });
    }
    copyLink(){
        if(!this.generatedLink){
            this.toast.add({severity: "warn",summary: "Warning",detail: "Payment link is empty"});
            return
        }
        navigator.clipboard.writeText(this.generatedLink).then(() => {
            this.toast.add({severity: "success",summary: "Success",detail: "Payment link copied to clipboard"});
        });
    }
    getFileIcon(fileName: string): string {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if(ext === 'pdf'){
            return 'assets/icons/pdf.svg';
        }else if(ext === 'doc' || ext === 'docx'){
            return 'assets/icons/doc.svg';
        }else{
            return 'assets/icons/image.svg';
        }
    }
    buildDocActions(doc: any): MenuItem[] {
        if(!doc){
            return [];
        }
        return [
            {
                label: 'Share',
                icon: 'pi pi-share-alt',
                command: () => this.shareDocument(doc),
            },
            {
                label: 'Get Sharable Link',
                icon: 'pi pi-link',
                command: () => this.getSharableLink(doc),
            },
            {
                separator: true
            },
            {
                label: 'Download',
                icon: 'pi pi-download',
                command: () => this.downloadDocument(doc),
            },
            {
                label: 'Rename',
                icon: 'pi pi-pencil',
                command: () => this.renameDocument(doc),
            },
            {
                label: 'Delete',
                icon: 'pi pi-trash',
                command: () => this.deleteDocument(doc),
            },
        ];
    }
    private getDocumentLink(doc: any): string {
        return doc?.download_link || doc?.url || doc?.link || doc?.path || doc?.file_path || '';
    }
    private getDocumentId(doc: any): any {
        return doc?.document_id ?? doc?.id ?? doc?.file_id ?? doc?.user_document_id ?? null;
    }
    private buildUserDocumentPayload(doc: any, extra: any = {}): any {
        const documentId = this.getDocumentId(doc);
        return {
            user_id: this.studentId,
            document_id: documentId,
            // send common alternative keys as well (backend variations)
            id: documentId,
            file_id: documentId,
            user_document_id: documentId,
            ...extra,
        };
    }
    shareDocument(doc: any){
        const link = this.getDocumentLink(doc);
        if(!link){
            this.toast.add({severity: "warn",summary: "Warning",detail: "Share link not available"});
            return;
        }
        if((navigator as any).share){
            (navigator as any).share({title: doc.name,text: 'Document from Docs Wallet',url: link}).catch(() => {});
        }else{
            navigator.clipboard.writeText(link).then(() => {
                this.toast.add({severity: "success",summary: "Copied",detail: "Link copied to clipboard"});
            });
        }
    }
    getSharableLink(doc: any){
        const link = this.getDocumentLink(doc);
        if(!link){
            this.toast.add({severity: "warn",summary: "Warning",detail: "Sharable link not available"});
            return;
        }
        navigator.clipboard.writeText(link).then(() => {
            this.toast.add({severity: "success",summary: "Copied",detail: "Sharable link copied"});
        });
    }
    downloadDocument(doc: any){
        const payload = this.buildUserDocumentPayload(doc);
        if(!payload.document_id){
            const link = this.getDocumentLink(doc);
            if(link){
                window.open(link,'_blank');
                return;
            }
            this.toast.add({severity: "warn",summary: "Warning",detail: "Document id/link not available"});
            return;
        }
        this.subscriberService.downloadUserDocument(payload).subscribe({
            next: (res: any) => {
                const fileBlob = res?.body as Blob;
                if(fileBlob && fileBlob.size > 0){
                    const contentDisposition = res?.headers?.get("content-disposition");
                    const serverFileName = this.getFileNameFromContentDisposition(contentDisposition);
                    const fallbackName = (doc?.name || "document").toString();
                    const fileName = serverFileName || fallbackName;
                    const objectUrl = URL.createObjectURL(fileBlob);
                    const anchor = document.createElement("a");
                    anchor.href = objectUrl;
                    anchor.download = fileName;
                    anchor.target = "_blank";
                    document.body.appendChild(anchor);
                    anchor.click();
                    document.body.removeChild(anchor);
                    URL.revokeObjectURL(objectUrl);
                    return;
                }
                const link = this.getDocumentLink(doc);
                if(link){
                    window.open(link,'_blank');
                    return;
                }
                this.toast.add({severity: "warn",summary: "Warning",detail: "Download data not available"});
            },
            error: (err) => {
                if(err?.status === 404){
                    const link = this.getDocumentLink(doc);
                    if(link){
                        window.open(link,'_blank');
                        return;
                    }
                }
                this.toast.add({severity: "error",summary: "Error",detail: err?.error?.message || "Failed to download document"});
            },
        });
    }
    private getFileNameFromContentDisposition(contentDisposition: string | null): string {
        if(!contentDisposition){
            return "";
        }
        const utf8FileNameMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
        if(utf8FileNameMatch?.[1]){
            return decodeURIComponent(utf8FileNameMatch[1].replace(/["']/g,"")).trim();
        }
        const fileNameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
        if(fileNameMatch?.[1]){
            return fileNameMatch[1].trim();
        }
        return "";
    }
    renameDocument(doc: any){
        const newName = prompt("Enter new file name",doc?.name || '');
        if(!newName || !newName.trim()){
            return;
        }
        const trimmed = newName.trim();
        const payload = this.buildUserDocumentPayload(doc,{
            new_name: trimmed,
            name: trimmed,
            file_name: trimmed,
        });
        if(!payload.document_id){
            this.toast.add({severity: "warn",summary: "Warning",detail: "Document id not available"});
            return;
        }
        this.subscriberService.renameUserDocument(payload).subscribe({
            next: (res: any) => {
                this.toast.add({severity: "success",summary: "Success",detail: res?.message || "Renamed successfully"});
                this.getUserDocuments();
            },
            error: (err) => {
                if(err?.status === 404){
                    // fallback: local rename if endpoint not found
                    doc.name = trimmed;
                    this.toast.add({severity: "warn",summary: "Warning",detail: "Rename API not found; renamed locally"});
                    return;
                }
                this.toast.add({severity: "error",summary: "Error",detail: err?.error?.message || "Failed to rename document"});
            },
        });
    }
    private removeDocumentLocally(doc: any){
        if(!doc || !this.userDocument){
            return;
        }
        if(this.userDocument.aadhar){
            if(this.userDocument.aadhar.front === doc){
                this.userDocument.aadhar.front = null;
            }
            if(this.userDocument.aadhar.back === doc){
                this.userDocument.aadhar.back = null;
            }
        }
        if(this.userDocument.pan){
            if(this.userDocument.pan.front === doc){
                this.userDocument.pan.front = null;
            }
            if(this.userDocument.pan.back === doc){
                this.userDocument.pan.back = null;
            }
        }
        const collections = ['education','payslip','experience','other'];
        collections.forEach((key) => {
            if(Array.isArray(this.userDocument[key])){
                const idx = this.userDocument[key].indexOf(doc);
                if(idx !== -1){
                    this.userDocument[key].splice(idx,1);
                }
            }
        });
    }
    deleteDocument(doc: any){
        if(!confirm("Are you sure you want to delete this document?")){
            return;
        }
        const payload = this.buildUserDocumentPayload(doc);
        if(!payload.document_id){
            this.toast.add({severity: "warn",summary: "Warning",detail: "Document id not available"});
            return;
        }
        this.subscriberService.deleteUserDocument(payload).subscribe({
            next: (res: any) => { 
                this.toast.add({severity: "success",summary: "Deleted",detail: res?.message || "Document deleted"});
                this.getUserDocuments();
            },
            error: (err) => {
                if(err?.status === 404){
                    // fallback: local remove if endpoint not found
                    this.removeDocumentLocally(doc);
                    this.toast.add({severity: "warn",summary: "Warning",detail: "Delete API not found; removed locally"});
                    return;
                }
                this.toast.add({severity: "error",summary: "Error",detail: err?.error?.message || "Failed to delete document"});
            },
        });
    }
}