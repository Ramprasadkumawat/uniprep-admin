
import {CommonModule} from "@angular/common";
import {Component,CUSTOM_ELEMENTS_SCHEMA,EventEmitter,Input,Output,ViewChild} from "@angular/core";
import {FormGroup,FormBuilder,Validators,ReactiveFormsModule,FormsModule,FormControl,ValidatorFn,AbstractControl} from "@angular/forms";
import {ConfirmationService,MessageService} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {DatePickerModule} from "primeng/datepicker";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {SelectModule} from "primeng/select";
import {TextareaModule} from "primeng/textarea";
import {MultiSelectModule} from "primeng/multiselect";
import {EditorModule} from "primeng/editor";
import {ActivatedRoute,Router} from "@angular/router";
import {DialogModule} from "primeng/dialog";
import {CheckboxModule} from "primeng/checkbox";
import {TagModule} from "primeng/tag";
import {TableModule} from "primeng/table";
import {FileUploadModule} from "primeng/fileupload";
import {CompaniesService} from "../companies.service";
import {JobsService} from "../../jobs/jobs.service";
import {NgxIntlTelInputModule,SearchCountryField} from "ngx-intl-tel-input";
import {HttpClient} from "@angular/common/http";
import {forkJoin} from 'rxjs';
import {CardModule} from "primeng/card";

@Component({
    selector: "uni-add-company",
    standalone: true,
    imports: [
        ButtonModule,
        ConfirmPopupModule,
        SelectModule,
        InputNumberModule,
        InputTextModule,
        DatePickerModule,
        TextareaModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        MultiSelectModule,
        EditorModule,
        DialogModule,
        CheckboxModule,
        TagModule,
        TableModule,
        FileUploadModule,
        NgxIntlTelInputModule,
        CardModule,
    ],
    templateUrl: "./add-company.component.html",
    styleUrl: "./add-company.component.scss",
    providers: [ConfirmationService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddCompanyComponent {
    @Input() editingCompanyId: number | null = null;
    @Input() companyDataToEdit: any = null;
    @Output() companySaved = new EventEmitter();
    @Output() targetInput: EventEmitter<string> = new EventEmitter();
    @Input() maxYear: Date = new Date();

    companyForm!: FormGroup;
    headQuartersList: any[] = [];
    countries: any[] = [];
    serviceTypes: any[] = [];
    companySizes: any[] = [];
    globalPresence: any[] = [];
    logoPreview: string | null = null;
    currentPage = 1;
    pageSize = 25;

    genderOptions = [
        {id: 'M',type: 'Male'},
        {id: 'F',type: 'Female'},
        {id: 'O',type: 'Prefer not to say'}
    ];
    selectedTab = {id: 1,name: 'View Company'};
    tabList = [
        {id: 1,name: 'View Company'},
        {id: 2,name: 'User Details'},
        {id: 3,name: 'Remarks'},
        {id: 4,name: 'Invites'},
        {id: 5,name: 'Payment Link'},
        {id: 6,name: 'Transaction History'},
        {id: 7,name: 'Share'}
    ];
    users = [];
    remarks = [];
    transactions = [];
    showRemarksDialog = false;
    showPaymentDialog = false;
    generatedLink: string | null = null;
    payments: any[] = [];
    remarksForm = this.fb.group({
        status: ['',Validators.required],
        followup_required: ['',Validators.required],
        followup_date: ['',Validators.required],
        followup_time: ['',Validators.required],
        remarks: ['',Validators.required]
    });
    paymentForm = this.fb.group({currency: ['',Validators.required],total_amount: ['',Validators.required],description: ['',Validators.required]});
    remarkStatusList = [
        {label: 'Interested in Campus Drive',value: 'Interested in Campus Drive'},
        {label: 'Interested in Hiring Support',value: 'Interested in Hiring Support'},
        {label: 'Interested in Project Support',value: 'Interested in Project Support'},
        {label: 'Happy',value: 'Happy'},
        {label: 'Not happy',value: 'Not happy'},
        {label: 'Neutral',value: 'Neutral'}
    ];
    yesNoList = [
        {label: 'Yes',value: 'Yes'},
        {label: 'No',value: 'No'}
    ];
    currencyList: any[] = [];
    initialTalentCredit: number | null = null;
    preferredCountry: any;
    SearchCountryField = SearchCountryField;

    invites: any[] = [];
    isViewMode: boolean = false;
    isEditMode: boolean = false;
    subscriptions: any[] = [];
    sourceNames: any[] = [];
    sourceNameOptions: {label: string;value: string}[] = [];
    private partnerSourceNameOptions: {label: string;value: string}[] = [];
    employerCountryId: any
    shareItems = [
        {title: 'Hiring Support',button: 'Hiring Support'},
        {title: 'Job Post',button: 'Job Post'},
        {title: 'Campus Hiring',button: 'Campus Hiring'}
    ];
    sourceTypes: any[] = [
        {label: 'Direct',value: 'Direct'},
        {label: 'Partner',value: 'Partner'}
    ];
    constructor(
        private fb: FormBuilder,
        private toast: MessageService,
        private router: Router,
        private companyService: CompaniesService,
        private jobService: JobsService,
        private http: HttpClient,
        private route: ActivatedRoute,
    ){}
    ngOnInit(): void {
        this.initializeForm();
        this.initializePhoneNumber();
        this.loadAllDropdowns();
        this.loadSourceNames();
        this.route.queryParams.subscribe(params => {
            const companyId = params['id'];
            const mode = params['mode'];
            if(companyId){
                this.editingCompanyId = parseInt(companyId);
                this.isViewMode = mode === 'view';
                this.isEditMode = mode === 'edit';
                this.companyService.showCompanyInfo({ id: this.editingCompanyId })
                    .subscribe(res => {
                        const company = res.data;
                        this.employerCountryId = company.employer_country_id;
                        this.loadSubscriptions(this.employerCountryId);
                        this.waitForDropdownsAndPatch(company);
                        if(this.isViewMode){
                            this.companyForm.disable();
                        }
                    });
            }else{
                this.companyService.companyToEdit$.subscribe(company => {
                    if(company){
                        this.editingCompanyId = company.id;
                        this.employerCountryId = company.employer_country_id;
                        this.loadSubscriptions(this.employerCountryId);
                        this.waitForDropdownsAndPatch(company);
                    }
                });
                this.companyService.getCompanyMode().subscribe(mode => {
                    this.isViewMode = mode === 'view';
                    this.isEditMode = mode === 'edit';
                    if(this.isViewMode && this.editingCompanyId){
                        this.companyForm.disable();
                    }
                });
            }
        });
    }
    ngOnChanges(): void {
        if(this.companyDataToEdit && this.editingCompanyId && this.subscriptions.length > 0){
            this.patchFormWithCompanyData(this.companyDataToEdit);
        }
    }
    initializePhoneNumber(){
        this.http.get("https://ipapi.co/json/").subscribe((data: any) => {
            this.preferredCountry = data.country_code.toLocaleLowerCase();
        });
    }
    initializeForm(): void {
        this.companyForm = this.fb.group({
            userName: ['',this.editingCompanyId ? [] : Validators.required],
            email: ['',[this.editingCompanyId ? [] : Validators.required,Validators.email]],
            contactNumber: ['',this.editingCompanyId ? [] : Validators.required],
            gender: ['',this.editingCompanyId ? [] : Validators.required],
            designation: ['',this.editingCompanyId ? [] : Validators.required],
            company: ['',Validators.required],
            companySize: ['',Validators.required],
            serviceType: ['',Validators.required],
            country: [null,Validators.required],
            headquartersLocation: ['',Validators.required],
            globalPresence: ['',Validators.required],
            website: ['',Validators.required],
            yearFounded: ['',Validators.required],
            linkedin: ['',Validators.required],
            aboutCompany: ["",[Validators.required,this.notEmptyHtmlValidator()]],
            companyLogo: [null,this.editingCompanyId ? [] : Validators.required],
            talentCredit: ['',[this.nonDecreasingValidator()]],
            subscriptions: [''],
            source_type: ['',Validators.required],
            source_name: ['',Validators.required],
        });
    }
    loadSubscriptions(countryId: number){
        this.companyService.getEmployerSubscription({country: countryId}).subscribe({
            next: (results) => {
                this.subscriptions = results || [];
            },error: (err) => {
                console.error('Error loading subscriptions:',err);
                this.toast.add({severity: "error",summary: "Error",detail: "Failed to load subscriptions"});
            }
        });
    }
    loadSourceNames(){
        this.companyService.getSourceNames().subscribe({
            next: (results) => {
                this.sourceNames = results?.data || [];
                this.partnerSourceNameOptions = (this.sourceNames || [])
                    .map((item: any) => {
                        const name = (item?.name ?? "").toString().trim();
                        return {label: name,value: name};
                    })
                    .filter((item: {label: string;value: string}) => !!item.value);
                if(this.companyForm.get("source_type")?.value === "Partner"){
                    this.onSourceTypeChange("Partner", true);
                }
            },error: (err) => {
                console.error('Error loading Source Names:',err);
                this.toast.add({severity: "error",summary: "Error",detail: "Failed to load Source Names"});
            }
        });
    }
    updateSubscription(){
        this.companyService.updateEmployerSubscription({company_id: this.editingCompanyId,subscription_id: this.companyForm.get('subscriptions')?.value}).subscribe({
            next: res => {
                if(res.status){
                    this.toast.add({severity: "success",summary: "Success",detail: res.message || "Subscription updated successfully"});
                }else{
                    this.toast.add({severity: "error",summary: "Error",detail: res.message || "Failed to update subscription"});
                }
            },
        });
    }
    private dropdownsLoaded = false;
    private pendingCompanyData: any = null;
    loadAllDropdowns(){
        forkJoin({
            dropdownData: this.jobService.getDropdownData(),
            companySize: this.companyService.getCompanySize(),
            globalPresence: this.companyService.getGlobalPresence(1),
            headQuarters: this.companyService.getHeadQuarters(1),
            countries: this.companyService.getWorldCountries(),
        }).subscribe({
            next: (results) => {
                this.serviceTypes = results.dropdownData?.company_service_type || [];
                this.currencyList = results.dropdownData?.currencycode || [];
                this.companySizes = results.companySize || [];
                this.globalPresence = results.globalPresence || [];
                this.headQuartersList = results.headQuarters || [];
                this.countries = results.countries || [];
                this.dropdownsLoaded = true;
                if(this.pendingCompanyData){
                    this.patchFormWithCompanyData(this.pendingCompanyData);
                    this.pendingCompanyData = null;
                }
            },error: (err) => {
                console.error('Error loading dropdowns:', err);
                this.toast.add({severity: "error",summary: "Error",detail: "Failed to load dropdown data"});
            }
        });
    }
    waitForDropdownsAndPatch(company: any){
        if(this.dropdownsLoaded){
            this.patchFormWithCompanyData(company);
        }else{
            this.pendingCompanyData = company;
        }
    }
    patchFormWithCompanyData(company: any){
        const globalPresence = company.global_presence ? company.global_presence.split(',').map((g: string) => +g) : [];
        const foundedYear = company.founded_year ? new Date(company.founded_year) : null;
        const serviceType = company.service_type ? company.service_type.split(',').map((g: string) => +g) : [];
        this.initialTalentCredit = Number(company.creditcount) || 0;
        const matchingSubscription = this.subscriptions.find(sub => sub.id === company.plan_name || sub.id === Number(company.plan_id));
        this.companyForm.patchValue({
            userName: company.user_name ?? '',
            email: company.email ?? '',
            contactNumber: company.contact_no ?? '',
            gender: company.gender ?? '',
            designation: company.designation ?? '',
            company: company.company_name ?? '',
            companySize: company.company_size ?? null,
            serviceType: serviceType,
            country: company.country ?? null,
            headquartersLocation: company.hq ?? null,
            globalPresence: globalPresence,
            website: company.website ?? '',
            yearFounded: foundedYear,
            linkedin: company.linkedin_link ?? '',
            aboutCompany: company.insight ?? '',
            companyLogo: company.company_logo ?? null,
            talentCredit: company.creditcount ?? '',
            subscriptions: matchingSubscription?.id ?? null,
            source_type: company.source_type ?? '',
            source_name: company.source_name ?? '',
        });
        this.onSourceTypeChange(company.source_type ?? "", true);
        if(company.company_logo){
            this.logoPreview = company.company_logo;
            this.companyForm.get('companyLogo')?.clearValidators();
            this.companyForm.get('companyLogo')?.updateValueAndValidity();
        }else{
            this.companyForm.get('companyLogo')?.setValidators(Validators.required);
            this.companyForm.get('companyLogo')?.markAsTouched();
            this.companyForm.get('companyLogo')?.updateValueAndValidity();
        }
    }
    enableEditMode(){
        this.isViewMode = false;
        this.isEditMode = true;
        this.companyForm.enable();
    }
    submitCompany(){
        if(this.editingCompanyId){
            this.updateCompany();
        }else{
            this.createCompany();
        }
    }
    createCompany(){
        if(this.companyForm.invalid){
            this.companyForm.markAllAsTouched();
            return;
        }
        const formValue = this.companyForm.value;
        const payload = this.buildCompanyPayload(formValue);
        this.companyService.addCompanyInfo(payload).subscribe({
            next: () => {
                this.companyForm.reset();
                this.initializeForm();
                this.toast.add({severity: "success",summary: "Success",detail: "Company created successfully"});
                this.companySaved.emit();
                this.router.navigate(["/companies/view-companies"]);
            },error: (err) => {
                console.error(err);
                this.toast.add({severity: "error",summary: "Error",detail: "Failed to create company"});
            }
        });
    }
    updateCompany(){
        if(!this.editingCompanyId){
            console.error("Company ID missing");
            return;
        }
        if(this.companyForm.get('subscriptions')?.value){
            this.updateSubscription();
        }
        const currentCredit = Number(this.companyForm.get('talentCredit')?.value);
        if(this.initialTalentCredit !== null && currentCredit < this.initialTalentCredit){
            this.companyForm.get('talentCredit')?.setErrors({decreasingValue: true});
            this.toast.add({severity: "warn",summary: "Invalid Talent Credit",detail: `Talent credit cannot be less than ${this.initialTalentCredit}`});
            return;
        }
        const formValue = this.companyForm.value;
        const payload = this.buildCompanyPayload(formValue);
        payload.append('company_id',this.editingCompanyId.toString());
        this.companyService.updateCompanyInfo(payload).subscribe({
            next: () => {
                this.companyForm.reset();
                this.editingCompanyId = null;
                this.toast.add({severity: "success",summary: "Success",detail: "Company updated successfully"});
                this.companySaved.emit();
                this.router.navigate(["/companies/view-companies"]);
            },error: (err) => {
                console.error(err);
                this.toast.add({severity: "error",summary: "Error",detail: "Failed to update company"});
            }
        });
    }
    buildCompanyPayload(formValue: any){
        const formData = new FormData();
        const foundedYear = this.companyForm.get('yearFounded').value instanceof Date ? this.companyForm.get('yearFounded').value.getFullYear().toString() : this.companyForm.get('yearFounded').value;
        formData.append('user_name',formValue.userName);
        formData.append('email',formValue.email);
        formData.append('contact_no',formValue.contactNumber?.number);
        formData.append('contact_no_code',formValue.contactNumber?.dialCode);
        formData.append('gender',formValue.gender);
        formData.append('designation',formValue.designation);
        formData.append('company_name',formValue.company);
        formData.append('company_size',formValue.companySize);
        formData.append('service_type',formValue.serviceType);
        formData.append('country',formValue.country);
        formData.append('hq',formValue.headquartersLocation);
        formData.append('global_presence',formValue.globalPresence);
        formData.append('website',formValue.website);
        formData.append('founded_year',foundedYear);
        formData.append('linkedin',formValue.linkedin);
        formData.append('insight',formValue.aboutCompany || '');
        formData.append('creditcount',formValue.talentCredit);
        formData.append('source_type',formValue.source_type);
        formData.append('source_name',formValue.source_name);
        if(formValue.companyLogo){
            formData.append('icon',formValue.companyLogo);
        }
        return formData;
    }

    onSourceTypeChange(sourceType: string,preserveExisting: boolean = false){
        const sourceNameControl = this.companyForm.get("source_name");
        const currentSourceName = (sourceNameControl?.value ?? "").toString().trim();

        if(sourceType === "Direct"){
            this.sourceNameOptions = [{label: "Uniprep",value: "Uniprep"}];
            sourceNameControl?.setValue("Uniprep");
            return;
        }

        if(sourceType === "Partner"){
            this.sourceNameOptions = [...this.partnerSourceNameOptions];
            const isCurrentInList = this.sourceNameOptions.some((item) => item.value === currentSourceName);
            // Keep existing value in edit mode while partner list is still loading.
            if(preserveExisting && currentSourceName && this.sourceNameOptions.length === 0){
                return;
            }
            if(preserveExisting && currentSourceName && !isCurrentInList){
                this.sourceNameOptions = [{label: currentSourceName,value: currentSourceName},...this.sourceNameOptions];
                return;
            }
            if(!preserveExisting || !isCurrentInList){
                sourceNameControl?.setValue("");
            }
            return;
        }

        this.sourceNameOptions = [];
        if(!preserveExisting){
            sourceNameControl?.setValue("");
        }
    }
    onLogoChange(event: any){
        const file = event.target.files[0];
        if(!file) return;
        this.companyForm.patchValue({companyLogo: file});
        const reader = new FileReader();
        reader.onload = () => this.logoPreview = reader.result as string;
        reader.readAsDataURL(file);
    }
    removeLogo(){
        this.logoPreview = null;
        this.companyForm.patchValue({ companyLogo: null });
        this.companyForm.get('companyLogo')?.setValidators(Validators.required);
        this.companyForm.get('companyLogo')?.markAsTouched();
        this.companyForm.get('companyLogo')?.updateValueAndValidity();
    }
    selectTab(tab: any){
        this.selectedTab = tab;
    }
    saveRemarks(){
        if(this.remarksForm.invalid){
            this.remarksForm.markAllAsTouched();
            return;
        }
        const payload = {company_id: this.editingCompanyId,...this.remarksForm.value}
        this.companyService.addCompanyFollowup(payload).subscribe(res => {
            this.remarksForm.reset();
            this.toast.add({severity: "success",summary: "Success",detail: "Remark saved successfully"});
            this.showRemarksDialog = false;
            this.companyService.showCompanyFollowup({page: this.currentPage,perpage: this.pageSize,company_id: this.editingCompanyId }).subscribe(res => {
                this.remarks = res.followups;
            })
        })
    }
    generatePaymentLink(){
        if(this.paymentForm.invalid){
            this.paymentForm.markAllAsTouched();
            return;
        }
        const payload = {company_id: this.editingCompanyId,...this.paymentForm.value}
        this.companyService.generatePaymentLink(payload).subscribe(res => {
            this.paymentForm.reset();
            if(res.message !== "Existing unpaid payment link"){
                this.toast.add({severity: "success",summary: "Success",detail: "Payment saved successfully"});
                this.generatedLink = res.data.payment_link;
                this.showPaymentDialog = false;
                this.onPageChangePayment({first: 0,rows: 25,page: 1})
                this.paymentForm.reset();
            }
            if(res.message === "Existing unpaid payment link"){
                this.toast.add({severity: "warn",summary: "Warning",detail: "An existing unpaid payment link already exists for this company. Please use the existing link."})
                this.generatedLink = res.data.payment_link
                this.showPaymentDialog = false
                this.onPageChangePayment({first: 0,rows: 25,page: 1})
                this.paymentForm.reset();
            }
        })
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
    copyLinkedin(){
        if(!this.companyForm.get('linkedin')?.value){
            this.toast.add({severity: "warn",summary: "Warning",detail: "LinkedIn profile is empty"});
            return
        }
        navigator.clipboard.writeText(this.companyForm.get('linkedin')?.value).then(() => {
            this.toast.add({severity: "success",summary: "Success",detail: "LinkedIn profile copied to clipboard"});
            window.open(this.companyForm.get('linkedin')?.value,"_blank");
        });
    }
    copyWebsite(){
        if(!this.companyForm.get('website')?.value){
            this.toast.add({severity: "warn",summary: "Warning",detail: "Website is empty"})
            return
        }
        navigator.clipboard.writeText(this.companyForm.get('website')?.value).then(() => {
            this.toast.add({severity: "success",summary: "Success",detail: "Website copied to clipboard"});
            window.open(this.companyForm.get('website')?.value,"_blank");
        });
    }
    downloadInvoice(invoice_url: string){
        window.open(invoice_url,"_blank");
    }
    onFocusInput(fieldKey: string){
        this.targetInput.emit(fieldKey);
    }
    resetMessageBox(){
        this.targetInput.emit("default");
    }
    getServiceText(ids: number[]){
        if(!ids?.length) return '';
        const names = this.serviceTypes.filter((i: any) => ids.includes(i.id)).map((i: any) => i.service_type);
        return names.length > 2 ? `${names.slice(0,2).join(', ')} +${names.length - 2}` : names.join(', ');
    }
    getHQText(id: number){
        return this.headQuartersList.find((h: any) => h.city_id === id)?.city_name || '';
    }
    getCompanySizeText(id: number){
        return this.companySizes.find((s: any) => s.id === id)?.size || '';
    }
    getGlobalPresenceText(ids: number[]){
        if(!ids?.length) return '';
        const names = this.globalPresence.filter((w: any) => ids.includes(w.id)).map((w: any) => w.country);
        return names.length > 2 ? `${names.slice(0,2).join(', ')} +${names.length - 2}` : names.join(', ');
    }
    aiGenerate(mode: string){
        const form = this.companyForm.value;
        if(mode !== 'Rephrase'){
            const requiredFields = ['company','serviceType','headquartersLocation','companySize','globalPresence','yearFounded'];
            const hasRequiredData = requiredFields.every(field => form[field]);
            if(!hasRequiredData){
                requiredFields.forEach(field => {
                    this.companyForm.get(field)?.markAsTouched();
                });
                return;
            }
        }
        const foundedYear = this.companyForm.get('yearFounded').value instanceof Date ? this.companyForm.get('yearFounded').value.getFullYear().toString() : this.companyForm.get('yearFounded').value;
        const AiGenerateData = {
            mode: mode,
            companyname: form.company,
            service_type: this.getServiceText(form.serviceType),
            hq: this.getHQText(form.headquartersLocation),
            company_size: this.getCompanySizeText(form.companySize),
            globalpresence: this.getGlobalPresenceText(form.globalPresence),
            foundedyear: foundedYear
        };
        const rePharseData = {mode: mode,content: form.aboutCompany};
        this.companyService.aiGenerate(mode === 'AI generate' ? AiGenerateData : rePharseData).subscribe({
            next: (response: any) => {
                this.companyForm.patchValue({aboutCompany: this.cleanHtmlList(response.data)});
            },error: () => {
            }
        });
    }
    isNotEmptyHtml(value: string): boolean {
        const val = value || "";
        return !!(val && val.trim() !== "" && val !== "<p></p>" && val !== "<p> </p>" && val.replace(/<[^>]*>/g,"").trim() !== "");
    }
    cleanHtmlList(html: string): string {
        html = html.replace(/<\/li>\s*/gi,"");
        const wrapper = document.createElement("div");
        wrapper.innerHTML = html;
        wrapper.querySelectorAll("li").forEach((li) => {
            const isEmpty = !li.textContent?.trim() || !li.innerHTML.replace(/&nbsp;| /gi,"").trim();
            if(isEmpty) li.remove();
        });
        return wrapper.innerHTML;
    }
    currentSortFieldUser: string | null = null;
    currentSortOrderUser: number = 1;
    currentFirstUser: number = 0;
    currentSortFieldRemark: string | null = null;
    currentSortOrderRemark: number = 1;
    currentFirstRemark: number = 0;
    currentSortFieldTransaction: string | null = null;
    currentSortOrderTransaction: number = 1;
    currentFirstTransaction: number = 0;
    currentSortFieldPayment: string | null = null;
    currentSortOrderPayment: number = 1;
    currentFirstPayment: number = 0;
    currentSortFieldInvites: string | null = null;
    currentSortOrderInvites: number = 1;
    currentFirstInvites: number = 0;
    @ViewChild('dtUser') tableUser: any;
    @ViewChild('dtRemark') tableRemark: any;
    @ViewChild('dtTransaction') tableTransaction: any;
    @ViewChild('dtPayment') tablePayment: any;
    @ViewChild('dtInvites') tableInvites: any;
    onPageChangeUser(event: any){
        const isSortToggle =
        event.sortField === this.currentSortFieldUser &&
        event.sortOrder !== this.currentSortOrderUser &&
        event.first === 0 &&
        this.currentFirstUser !== 0;
        if(isSortToggle){
            event.first = this.currentFirstUser;
        }
        this.currentSortFieldUser = event.sortField;
        this.currentSortOrderUser = event.sortOrder;
        this.currentFirstUser = event.first;
        this.currentPage = (event.first / event.rows) + 1;
        this.pageSize = event.rows;
        const params = {page: this.currentPage,perpage: this.pageSize,company_id: this.editingCompanyId};
        this.companyService.getEmployerList(params).subscribe({
            next: (res) => {
                if(res && res.data){
                    this.users = res.data || [];
                    if(this.currentSortFieldUser){
                        this.users.sort((a,b) => {
                            let aValue = a[this.currentSortFieldUser!];
                            let bValue = b[this.currentSortFieldUser!];
                            if(aValue == null) aValue = '';
                            if(bValue == null) bValue = '';
                            if(typeof aValue === 'string') aValue = aValue.toLowerCase();
                            if(typeof bValue === 'string') bValue = bValue.toLowerCase();
                            let result = 0;
                            if(aValue < bValue) result = -1;
                            else if(aValue > bValue) result = 1;
                            return this.currentSortOrderUser * result;
                        });
                    }
                    if(isSortToggle && this.tableUser){
                        setTimeout(() => {
                            this.tableUser.first = this.currentFirstUser;
                        },0);
                    }
                }
            },error: (err) => {
                console.error('Error on page change:',err);
            }
        });
    }
    onPageChangeRemark(event: any){
        const isSortToggle =
        event.sortField === this.currentSortFieldRemark &&
        event.sortOrder !== this.currentSortOrderRemark &&
        event.first === 0 &&
        this.currentFirstRemark !== 0;
        if(isSortToggle){
            event.first = this.currentFirstRemark;
        }
        this.currentSortFieldRemark = event.sortField;
        this.currentSortOrderRemark = event.sortOrder;
        this.currentFirstRemark = event.first;
        this.currentPage = (event.first / event.rows) + 1;
        this.pageSize = event.rows;
        const params = {page: this.currentPage,perpage: this.pageSize,company_id: this.editingCompanyId};
        this.companyService.showCompanyFollowup(params).subscribe({
            next: (res) => {
                if(res){
                    this.remarks = res.followups || [];
                    if(this.currentSortFieldRemark){
                        this.remarks.sort((a,b) => {
                            let aValue = a[this.currentSortFieldRemark!];
                            let bValue = b[this.currentSortFieldRemark!];
                            if(aValue == null) aValue = '';
                            if(bValue == null) bValue = '';
                            if(typeof aValue === 'string') aValue = aValue.toLowerCase();
                            if(typeof bValue === 'string') bValue = bValue.toLowerCase();
                            let result = 0;
                            if(aValue < bValue) result = -1;
                            else if(aValue > bValue) result = 1;
                            return this.currentSortOrderRemark * result;
                        });
                    }
                    if(isSortToggle && this.tableRemark){
                        setTimeout(() => {
                            this.tableRemark.first = this.currentFirstRemark;
                        },0);
                    }
                }
            },error: (err) => {
                console.error('Error on page change:',err);
            }
        });
    }

    onPageChangeTransactionHistory(event: any){
        const isSortToggle = event.sortField === this.currentSortFieldTransaction && event.sortOrder !== this.currentSortOrderTransaction && event.first === 0 && this.currentFirstTransaction !== 0;
        if(isSortToggle){
            event.first = this.currentFirstTransaction;
        }
        this.currentSortFieldTransaction = event.sortField;
        this.currentSortOrderTransaction = event.sortOrder;
        this.currentFirstTransaction = event.first;
        this.currentPage = (event.first / event.rows) + 1;
        this.pageSize = event.rows;
        const params = {page: this.currentPage,perpage: this.pageSize,company_id: this.editingCompanyId};
        this.companyService.subscriptionTransactionHistory(params).subscribe({
            next: (res) => {
                if(res){
                    this.transactions = res.histories || [];
                    if(this.currentSortFieldTransaction){
                        this.transactions.sort((a,b) => {
                            let aValue = a[this.currentSortFieldTransaction!];
                            let bValue = b[this.currentSortFieldTransaction!];
                            if(aValue == null) aValue = '';
                            if(bValue == null) bValue = '';
                            if(typeof aValue === 'string') aValue = aValue.toLowerCase();
                            if(typeof bValue === 'string') bValue = bValue.toLowerCase();
                            let result = 0;
                            if(aValue < bValue) result = -1;
                            else if(aValue > bValue) result = 1;
                            return this.currentSortOrderTransaction * result;
                        });
                    }
                    if(isSortToggle && this.tableTransaction){
                        setTimeout(() => {
                            this.tableTransaction.first = this.currentFirstTransaction;
                        },0);
                    }
                }
            },error: (err) => {
                console.error('Error on page change:',err);
            }
        });
    }
    onPageChangePayment(event: any){
        const isSortToggle = event.sortField === this.currentSortFieldPayment && event.sortOrder !== this.currentSortOrderPayment && event.first === 0 && this.currentFirstPayment !== 0;
        if(isSortToggle){
            event.first = this.currentFirstPayment;
        }
        this.currentSortFieldPayment = event.sortField;
        this.currentSortOrderPayment = event.sortOrder;
        this.currentFirstPayment = event.first;
        this.currentPage = (event.first / event.rows) + 1;
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
            },
            error: (err) => {
                console.error('Error on page change:',err);
            }
        });
    }
    onPageChangeInvites(event: any){
        const isSortToggle = event.sortField === this.currentSortFieldInvites && event.sortOrder !== this.currentSortOrderInvites && event.first === 0 && this.currentFirstInvites !== 0;
        if(isSortToggle){
            event.first = this.currentFirstInvites;
        }
        this.currentSortFieldInvites = event.sortField;
        this.currentSortOrderInvites = event.sortOrder;
        this.currentFirstInvites = event.first;
        this.currentPage = (event.first / event.rows) + 1;
        this.pageSize = event.rows;
        const params = {page: this.currentPage,perpage: this.pageSize,company_id: this.editingCompanyId};
        this.companyService.getCompanyInvites(params).subscribe({
            next: (res) => {
                if(res){
                    this.invites = res.data.invites || [];
                    if(this.currentSortFieldInvites){
                        this.invites.sort((a,b) => {
                            let aValue = a[this.currentSortFieldInvites!];
                            let bValue = b[this.currentSortFieldInvites!];
                            if(aValue == null) aValue = '';
                            if(bValue == null) bValue = '';
                            if(typeof aValue === 'string') aValue = aValue.toLowerCase();
                            if(typeof bValue === 'string') bValue = bValue.toLowerCase();
                            let result = 0;
                            if(aValue < bValue) result = -1;
                            else if(aValue > bValue) result = 1;
                            return this.currentSortOrderInvites * result;
                        });
                    }
                    if(isSortToggle && this.tableInvites){
                        setTimeout(() => {
                            this.tableInvites.first = this.currentFirstInvites;
                        },0);
                    }
                }
            },
            error: (err) => {
                console.error('Error on page change:',err);
            }
        });
    }
    getWordCountUsingControl(control: FormControl | any){
        let wordCount = 0;
        if(control.value){
            const words = control.value.replace(/<\/?[^>]+(>|$)/g,"").match(/\b\w+\b/g) || [];
            wordCount = words.length;
        }
        return wordCount;
    }
    checkMaximumWordsInFields(control: FormControl | any,maxNumber: number = 2000): void {
        if(control?.value){
            const words = control.value.replace(/<\/?[^>]+(>|$)/g,"").match(/\b\w+\b/g) || [];
            const wordCount = words.length;
            const wordLimitExceeded = wordCount > maxNumber;
            if(wordLimitExceeded){
                control.setValue(control.value,{emitEvent: false});
                control.setErrors({maxWordsExceeded: true});
            }else{
                if(control.hasError("maxWordsExceeded")){
                    const errors = {...control.errors};
                    delete errors["maxWordsExceeded"];
                    control.setErrors(Object.keys(errors).length ? errors : null);
                }
            }
        }
    }
    notEmptyHtmlValidator(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} | null => {
            const value = control.value || "";
            if(!value || value.trim() === "" || value === "<p></p>" || value === "<p>&nbsp;</p>" || value.replace(/<[^>]*>/g, "").trim() === ""){
                return { emptyHtml: true };
            }
            return null;
        };
    }
    nonDecreasingValidator(): ValidatorFn {
        return (control: AbstractControl) => {
            if(this.initialTalentCredit === null){
                return null;
            }
            const currentValue = Number(control.value);
            if(isNaN(currentValue)){
                return null;
            }
            if(currentValue < this.initialTalentCredit){
                return {decreasingValue: {minAllowed: this.initialTalentCredit}};
            }
            return null;
        };
    }
    ngOnDestroy(): void {
        this.companyService.clearCompanyToEdit();
    }
}