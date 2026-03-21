import {Component,OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputTextModule} from "primeng/inputtext";
import {ConfirmationService,MessageService} from 'primeng/api';
import {TableModule} from "primeng/table";
import {AccordionModule} from "primeng/accordion";
import {SelectModule} from "primeng/select";
import {TextareaModule} from 'primeng/textarea';
import {FormBuilder,FormGroup,ReactiveFormsModule,Validators} from '@angular/forms';
import {UserType} from 'src/app/@Models/user.model';
import {filter,Observable} from 'rxjs';
import {SubscriptionService} from './subscription.service';
import {SubscriptionPlan} from 'src/app/@Models/subscription';
import {ToastModule} from "primeng/toast";
import {MultiSelectModule} from 'primeng/multiselect';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import {DatePickerModule} from 'primeng/datepicker';
import {Router} from '@angular/router';
import {LocalStorageService} from 'ngx-localstorage';
import {AuthService} from 'src/app/Auth/auth.service';
import {TabsModule} from 'primeng/tabs';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'uni-subscription',
    imports: [CommonModule,InputTextModule,TableModule,AccordionModule,SelectModule,TextareaModule,ReactiveFormsModule,ToastModule,MultiSelectModule,ConfirmPopupModule,DatePickerModule,TabsModule],
    templateUrl: './subscription.component.html',
    styleUrls: ['./subscription.component.scss'],
    providers: [ConfirmationService]
})
export class SubscriptionComponent implements OnInit {
    userTypes$!: Observable<UserType[]>;
    form: FormGroup;
    editform: FormGroup;
    filterForm: FormGroup;
    submitted: boolean = false;
    editFormSubmitted: boolean = false;
    addsubscription = true;
    editsubscription = false;
    pageSize = 25;
    page: number = 1;
    subscriptionList: any[] = [];
    subscriptions$!: Observable<SubscriptionPlan[]>;
    subscriptionCount: number = 0;
    countryList: any[] = [];
    countryOptions: Array<{id: any; name: string}> = [];
    subscriptionId: number = 0;
    activeIndex: number = -1;
    subscriptionPlanList: any[] = [{id: null,name: 'Select'},{id: 1,name: 'Student'},{id: 2,name: 'Career'},{id: 3,name: 'Entrepreneur'}];
    chatLimitList: any[] = [{id: null,name: 'Select'},{id: 1,name: '1'},{id: 2,name: '2'},{id: 3,name: '3'}];
    currencyoption: any[] = [{id: null,name: 'Select'},{id: 'INR',name: 'INR'},{id: 'EUR',name: 'EUR'},{id: 'USD',name: 'USD'},{id: 'GBP',name: 'GBP'}];
    validityoption: any[] = [{id: null,name: 'Select'},{id: 6,name: '6 Months'},{id: 12,name: '12 Months'}];
    couponCodeList: any[] = [{id: null,name: 'Select'},{id: 1,name: 'Yes'},{id: 2,name: 'No'}];
    countryRestrictionList: any[] = [{id: null,name: 'Select'},{id: 1,name: '1'},{id: 2,name: '2'},{id: 3,name: '3'},{id: 4,name: '4'},{id: 5,name: '5'},
    {id: 6,name: '6'},{id: 7,name: '7'},{id: 8,name: '8'},{id: 9,name: '9'},{id: 10,name: '10'},{id: 11,name: '11'},{id: 12,name: '12'}];
    subscriptionTypeList: any[] = [{id: null,name: 'Select'},{id: 1,name: 'Direct Student User'}];
    addUserTypeOptions: Array<{label: string; value: string | null}> = [{label: 'Select',value: null}];
    addSubscriptionTypeOptions: Array<{label: string; value: string | null}> = [{label: 'Select',value: null}];
    addValidityOptions: Array<{label: string; value: string | null}> = [{label: 'Select',value: null}];
    addCurrencyOptions: Array<{id: string | null; currency_code: string}> = [{id: null,currency_code: 'Select'}];
    minimumDate!: Date;
    userId!: number;
    canDelete: boolean = false;
    activeTabIndex: number = 0;
    monthlyPlan: number = 3;
    currentCountry: string = "India";
    continent: string = "Asia";
    currency: string = "INR";
    subscription_plan_id: number = 0;
    constructor(private fb: FormBuilder,
        private subscriptionService: SubscriptionService,private confirmationService: ConfirmationService,
        private toast: MessageService,private router: Router,private storage: LocalStorageService,
        private authService: AuthService,private http: HttpClient,){
        this.form = fb.group({
            subscriptionType: [null,[Validators.required]],subscriptionPlan: [null,[Validators.required,]],
            country: [null,[Validators.required]],
            actualPrice: ['',[Validators.required]],
            currency: [null,[Validators.required]],
            validity: ['',[Validators.required]],
            discountPercentage: ['',[Validators.required]],
            givenPrice: ['',[Validators.required]],
        });
        this.editform = fb.group({
            subscriptionType: [null,[Validators.required]],subscriptionPlan: [null,[Validators.required,]],
            actualPrice: ['',[Validators.required]],
            currency: [null,[Validators.required]],
            validity: ['',[Validators.required]],
            discountPercentage: ['',[Validators.required]],
            givenPrice: ['',[Validators.required]],
        });
        this.filterForm = fb.group({
            subscriptionType: [null],
            subscriptionPlan: [null],
            country: [null],
        });
    }
    ngOnInit(): void {
        this.loadSubscriptionList();
        this.getCountryList();
        this.getCreateFormDropdowns();
        this.getMe();
    }
    get f(){
        return this.form.controls;
    }
    get ef(){
        return this.editform.controls;
    }
    loadSubscriptionList(){
        this.getSubscriptionList(this.buildSubscriptionParams(this.page));
    }
    getMe(){
        this.authService.getUserDetails$.pipe(filter(user => !!user)).subscribe(res => {
                this.userId = res[0].usertype_id;
                if(this.userId == 21){
                    this.canDelete = true;
                }
            });
    }
    getSubscriptionList(data: any){
        this.subscriptionService.getUserSubscriptionsForAdmin(data).subscribe((response) => {
            const subscriptions = response?.data?.subscriptions || [];
            this.subscriptionList = subscriptions.map((sub: any) => ({
                id: sub?.subscriptionId,
                subscription_plan_id: sub?.subscriptionId,
                subscription_type: sub?.userType,
                subscription_plan: sub?.plan_name,
                subtypeName: sub?.userType,
                actualprice: sub?.actual_price,
                discountpercentage: sub?.save,
                givenprice: sub?.price,
                validity: sub?.validity,
                currency: sub?.currency,
                country: sub?.country,
                payment_gateway: sub?.payment_gateway,
                subscriptionType: sub?.subscriptionType,
                userType: sub?.userType,
            }));
            this.subscriptionCount = response?.data?.count || this.subscriptionList.length;
        });
    }
    getCountryList(){
        this.subscriptionService.getWorldCountries().subscribe(response => {
            const countries = Array.isArray(response) ? response : (response?.data || []);
            this.countryList = countries;
            this.countryOptions = (countries || []).map((country: any) => ({id: country?.id,name: country?.country_name})).filter((country: {id: any; name: string}) => country.id != null && !!country.name);
        });
    }
    getSubscriptionTypeList(){
        this.subscriptionService.getSubscriptionType().subscribe((response) => {
            //this.subscriptionTypeList = [{id: null,subtypeName: 'Select'},...response];
        });
    }
    getCreateFormDropdowns(){
        this.subscriptionService.getUserSubscriptionsDropdowns({}).subscribe({
            next: (response: any) => {
                const data = response?.data || {};
                this.addUserTypeOptions = [{label: 'Select',value: null},...(data?.usertype || [])];
                this.addSubscriptionTypeOptions = [{label: 'Select',value: null},...(data?.subscriptionType || [])];
                this.addValidityOptions = [{label: 'Select',value: null},...(data?.validity || []).map((item: any) => ({label: item?.label,value: String(item?.value ?? '')}))];
                this.addCurrencyOptions = [{id: null,currency_code: 'Select'},...(data?.currencies || []).map((item: any) => ({id: item?.currency_code,currency_code: item?.currency_code}))];
            },error: () => {
                this.toast.add({severity: 'error',summary: 'Error',detail: 'Failed to load create form dropdowns'});
            }
        });
    }
    submitForm(){
        this.submitted = true;
        if(this.form.invalid){
            return;
        }
        const formData = this.form.value;
        this.subscriptionService.addSubscriptionPlan(formData).subscribe((response) => {
            this.toast.add({severity: 'success',summary: 'Success',detail: response.message});
            this.submitted = false;
            this.form.reset();
            this.loadSubscriptionList();
        });
    }
    getDiffernceOfTwoDates(fromDate: string,toDate: string){
        const date1: any = new Date(fromDate);
        const date2: any = new Date(toDate);
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
    editFormSubmit(){
        this.editFormSubmitted = true;
        if(this.editform.invalid){
            return;
        }
        const formData = this.editform.value;
        this.subscriptionService.editSubscriptionPlan({...formData,id: this.subscriptionId,subscription_plan_id: this.subscription_plan_id}).subscribe((response) => {
            this.toast.add({severity: 'success',summary: 'Success',detail: response.message});
            this.editFormSubmitted = false;
            this.editform.reset();
            this.editsubscription = false;
            this.addsubscription = true;
            this.loadSubscriptionList();
        });
    }
    pageChange(event: any){
        const page = event.first / this.pageSize + 1;
        this.page = page;
        this.getSubscriptionList(this.buildSubscriptionParams(page));
    }
    editoption(data: SubscriptionPlan){
        this.activeIndex = 0;
        this.addsubscription = false;
        this.editsubscription = true;
        this.subscriptionId = data.id;
        this.subscription_plan_id = data?.subscription_plan_id;
        this.editform.patchValue({
            subscriptionType: Number(data.subscription_type),
            subscriptionPlan: data.subscription_plan,
            actualPrice: data.actualprice,
            validity: data.validity,
            currency: data.currency,
            discountPercentage: data.discountpercentage,
            givenPrice: data.givenprice,
        });
    }
    deleteSubscription(event: Event,id: number,subscriptionPlanId){
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to delete?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.subscriptionService.deleteSubscriptionPlan(id,subscriptionPlanId).subscribe((response) => {
                    this.toast.add({severity: 'success',summary: 'Success',detail: response.message});
                    this.loadSubscriptionList();
                });
            },reject: () => {
                this.toast.add({severity: 'error',summary: 'Rejected',detail: 'You have rejected'});
            }
        });
    }
    addSubscriptionPlan(){
        this.activeIndex = 0;
        this.addsubscription = true;
        this.editsubscription = false;
    }
    closeAccodion(){
        this.activeIndex = -1;
    }
    dateValidation(date: Date){
        this.minimumDate = date;
        if(this.addsubscription){
            const toDate = this.form.value.validityTo;
            if(date > toDate){
                this.form.get('validityTo')?.reset()
            }
        }else{
            const toDate = this.editform.value.validityTo;
            if(date > toDate){
                this.editform.get('validityTo')?.reset()
            }
        }
    }
    navigateCollegeSubscription(){
        this.router.navigate(['subscription-college-view'])
    }
    navigateStudentSubscription(){
        this.router.navigate(['subscription-student-view'])
    }
    navigateSubscriptionHistory(){
        this.router.navigate(['subscription-history'])
    }
    applyFilter(){
        this.page = 1;
        this.getSubscriptionList(this.buildSubscriptionParams(1));
    }
    resetFilter(){
        this.filterForm.reset();
        this.page = 1;
        this.loadSubscriptionList();
    }
    private buildSubscriptionParams(page: number){
        const filterValues = this.filterForm?.value || {};
        return {
            page: page,
            perpage: this.pageSize,
            user_type: filterValues.subscriptionType || undefined,
            subscription_type: filterValues.subscriptionPlan || undefined,
            country: filterValues.country || undefined,
        };
    }
    changeMonthlyPlan(event){
        let tabIndex = event.index;
        if(tabIndex == 0){
            this.monthlyPlan = 3;
        }else if(tabIndex == 1){
            this.monthlyPlan = 6;
        }else{
            this.monthlyPlan = 12;
        }
        this.loadSubscriptionList();
    }
}
