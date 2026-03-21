import { Component, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { RecruitmentService } from "../recruitment.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
  selector: "uni-view-order",
  templateUrl: "./view-order.component.html",
  styleUrls: ["./view-order.component.scss"],
  standalone: false,
})
export class ViewOrderComponent implements OnInit {
  hiringSupportFilterForm!: FormGroup;
  orders: any[] = [];
  filteredOrders: any[] = [];
  positions: any[] = [];
  visiblePositions: any[] = [];
  private readonly BATCH_SIZE = 100;
  private currentPositionIndex = 0;
  private allPositionsLoaded = false;
  orderStatus: any[] = [
    { label: "In Review", value: "In Review" },
    { label: "Approved", value: "Approved" },
    { label: "Reject", value: "Reject" },
    { label: "Process", value: "Process" },
    { label: "In Process", value: "In Process" },
    { label: "Completed", value: "Completed" },
  ];
  orderStatusOptions: any[] = [
    { label: "In Review", value: "In Review" },
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
  ];
  paymentStatusOptions: any[] = [
    { label: "Paid", value: 1 },
    { label: "Pay Later", value: 2 },
  ];
  revenueStatusOptions: any[] = [
    { label: "Paid", value: "Paid" },
    { label: "Pay Later", value: "Pay Later" },
  ];
  total: number = 0;
  totalCount: number = 0;
  getCount: number = 0;
  page: number = 1;
  pageSize: number = 25;
  isFilterExpanded: boolean = false;
  sortField: string = "order_id";
  sortOrder: number = 1; // 1 for ascending, -1 for descending
  selectedTab: number = 0;
  orderDialogVisible: boolean = false;
  selectedOrder: any = null;
  workLocations: any[] = [];
  isEditMode: boolean = false;
  editForm!: FormGroup;
  paymentLink: string = "";
  paymentLinkDialogVisible: boolean = false;
  languages: any[] = [];
  languageProficiency: any[] = [];
  employmentTypeOptions: any[] = [];
  workMode: any[] = [];
  minimumEducation: any[] = [];
  currency: any[] = [];
  isLoadingAiGenerate: boolean = false;

  // View Talents Dialog
  viewTalentsDialogVisible: boolean = false;
  mappedTalents: any[] = [];
  isLoadingTalents: boolean = false;
  selectedOrderForTalents: any = null;

  summaryCards: any[] = [
    {
      label: "Vacancies",
      value: 0,
      class: "card-total-requirements",
      filter: "all",
    },
    {
      label: "Talent Delivery",
      value: 0,
      class: "card-total-requirements",
      filter: "requirements",
    },
    {
      label: "Delivered Talent",
      value: 0,
      class: "card-total-requirements",
      filter: "talents",
    },
    {
      label: "Order Completed",
      value: 0,
      class: "card-total-requirements",
      filter: "completed",
    },
    {
      label: "Paid",
      value: 0,
      class: "card-total-requirements",
      filter: "paid",
    },
    {
      label: "Pay Later",
      value: 0,
      class: "card-total-requirements",
      filter: "paylater",
    },
    {
      label: "In Review",
      value: 0,
      class: "card-total-requirements",
      filter: "inreview",
    },
    {
      label: "Approved",
      value: 0,
      class: "card-total-requirements",
      filter: "approved",
    },
    {
      label: "Rejected",
      value: 0,
      class: "card-total-requirements",
      filter: "reject",
    },
    {
      label: "In Progress",
      value: 0,
      class: "card-total-requirements",
      filter: "inprogress",
    },
    {
      label: "Completed",
      value: 0,
      class: "card-total-requirements",
      filter: "completed",
    },
    {
      label: "Total Revenue",
      value: 0,
      class: "card-total-requirements",
      filter: "all"
    }
  ];

  initialFormValue!: any;

  constructor(
    private recruitmentService: RecruitmentService,
    private fb: FormBuilder,
    private toast: MessageService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.loadDropdownData();
    this.getHiringSupport();
    this.initializeFilterForm();
    this.getWorkLocations();
    this.getDropdowns();
    // Initialize edit form with empty values
    this.editForm = this.fb.group({
      companyName: ["", Validators.required],
      jobTitle: ["", Validators.required],
      orderId: ["", Validators.required],
      createdBy: ["", Validators.required],
      vacancies: [0, Validators.required],
      shortlistTalents: [0, Validators.required],
      employmentType: [""],
      workLocation: [""],
      workMode: [""],
      experience: [""],
      salaryCurrency: ["INR"],
      minSalary: [0],
      maxSalary: [0],
      startDate: [""],
      languages: this.fb.array([this.createLanguageForm()]),
      minEducation: [""],
      orderStatus: [""],
      paymentStatus: [""],
      rolesResponsibilities: [""],
      notes: [""],
      remarks: [""],
    });
  }

  initializeFilterForm() {
    this.hiringSupportFilterForm = this.fb.group({
      orderId: [""],
      companyName: [""],
      paymentStatus: [""],
      revenueStatus: [""],
      keyword: [""],
      jobTitle: [""],
      orderStatus: [""],
    });
  }

  toggleFilterSection() {
    this.isFilterExpanded = !this.isFilterExpanded;
  }

  loadDropdownData() {
    this.recruitmentService.getDropdownData().subscribe((res) => {
      this.positions = res.positions || [];
      this.initializeLazyPositions();
    });
  }

  private initializeLazyPositions() {
    this.currentPositionIndex = 0;
    this.allPositionsLoaded = false;
    this.visiblePositions = [];

    if (this.positions.length > 0) {
      const firstBatch = this.positions.slice(0, this.BATCH_SIZE);
      this.visiblePositions = [...firstBatch];
      this.currentPositionIndex = this.BATCH_SIZE;
    }
  }

  loadPositionsLazy(event: any) {
    if (!this.allPositionsLoaded) {
      this.loadNextPositionBatch();
    }
  }

  private loadNextPositionBatch() {
    if (this.currentPositionIndex >= this.positions.length) {
      this.allPositionsLoaded = true;
      return;
    }

    const nextBatch = this.positions.slice(
      this.currentPositionIndex,
      this.currentPositionIndex + this.BATCH_SIZE
    );

    this.visiblePositions = [...this.visiblePositions, ...nextBatch];
    this.currentPositionIndex += this.BATCH_SIZE;
  }

  getDropdowns() {
    this.recruitmentService.getDropdownData().subscribe((res) => {
      this.languages = res.language || [];
      this.minimumEducation = res.minimumeducation || [];
      this.currency = res.currencycode || [];
      this.positions = res.positions || [];
      this.initializeLazyPositions();
      this.initializeLanguageProficiency(res.proficiencylevel);
    });

    this.recruitmentService.hiringSupportDropdown(null).subscribe((d) => {
      this.workMode = d.data?.workMode || [];
      this.employmentTypeOptions = d.data?.employmentTypeOptions || [];
    });
  }

  getWorkLocations() {
    this.recruitmentService.getWorkLocationDropdownData().subscribe((res) => {
      this.workLocations = res.worklocations || [];
    });
  }

  private initializeLanguageProficiency(proficiencyLevel: any[]) {
    if (proficiencyLevel && proficiencyLevel.length > 0) {
      this.languageProficiency = proficiencyLevel.map((level: any) => {
        if (typeof level === "string") {
          return { label: level, value: level };
        }
        return {
          label: level.label || level.proficiencylevel || level,
          value: level.label || level.proficiencylevel || level.id || level,
        };
      });
    } else {
      this.languageProficiency = [
        { label: "Basic", value: "Basic" },
        { label: "Intermediate", value: "Intermediate" },
        { label: "Advanced", value: "Advanced" },
        { label: "Native", value: "Native" },
      ];
    }
  }

  getLanguagesArray(): FormArray {
    return this.editForm.get("languages") as FormArray;
  }

  addLanguage() {
    const languagesArray = this.getLanguagesArray();
    languagesArray.push(this.createLanguageForm());
  }

  removeLanguage(index: number) {
    const languagesArray = this.getLanguagesArray();
    if (languagesArray.length > 1) {
      languagesArray.removeAt(index);
    }
  }

  getTextLength(html: string): number {
    if (!html) return 0;
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent?.trim().length || 0;
  }

  isNotEmptyHtml(value: string): boolean {
    if (!value) return false;
    const div = document.createElement("div");
    div.innerHTML = value;
    return (div.textContent?.trim()?.length ?? 0) > 0;
  }

  aiGenerate(field: "roles" | "notes", type: "generate" | "rephrase") {
    const fieldName = field === "roles" ? "rolesResponsibilities" : "notes";
    const jobTitle = this.editForm.get("jobTitle")?.value;
    const currentValue = this.editForm.get(fieldName)?.value;

    if (type === "generate" && !jobTitle) {
      this.toast.add({
        severity: "warn",
        summary: "Warning",
        detail: "Please enter Job Title first",
      });
      return;
    }

    this.isLoadingAiGenerate = true;
    const fieldType = field === "roles" ? "keyresponsibilities" : "notes";

    const aiData =
      type === "generate"
        ? {
          mode: "keyresponsibilities",
          position_title: jobTitle,
          type: "AI generate",
        }
        : { mode: fieldType, type: "rephrase", content: currentValue };

    this.recruitmentService.aiGenerateApi(aiData, "job-ai-generate").subscribe({
      next: (response: any) => {
        this.isLoadingAiGenerate = false;
        const cleanText = this.cleanHtmlList(response.response || response);
        this.editForm.patchValue({ [fieldName]: cleanText });
      },
      error: (err) => {
        this.isLoadingAiGenerate = false;
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to generate content",
        });
      },
    });
  }

  cleanHtmlList(html: string): string {
    if (!html) return "";
    html = html.replace(/<\/li>\s*<br\s*\/?>/gi, "</li>");
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    wrapper.querySelectorAll("li").forEach((li) => {
      const isEmpty =
        !li.textContent?.trim() ||
        !li.innerHTML.replace(/<br\s*\/?>|&nbsp;/gi, "").trim();
      if (isEmpty) li.remove();
    });
    return wrapper.innerHTML;
  }

  getHiringSupport() {
    // Call with pagination parameters to get all orders
    // Use a large perpage value to get all records initially
    const filterData: any = {
      page: this.page,
      perpage: 1000, // Request a large number to get all records
    };
    this.recruitmentService.getHiringSupportTransactions(filterData).subscribe({
      next: (res) => {
        console.log("API Response:", res);
        if (
          res.status &&
          res.data &&
          res.data.transactions &&
          Array.isArray(res.data.transactions)
        ) {
          console.log("Transactions received:", res.data.transactions.length);
          // Transform the nested structure to flat array
          this.orders = this.transformResponseData(res.data.transactions);
          console.log("Flattened orders:", this.orders.length);
          // Use total_requirements for the count of individual requirement records
          // If not available, use the length of flattened orders array
          const flattenedCount = this.orders.length;
          this.total =
            res.data.total_requirements ||
            res.data.total_records ||
            flattenedCount ||
            0;
          this.totalCount =
            res.data.total_requirements ||
            res.data.total_records ||
            flattenedCount ||
            0;
          this.getCount =
            res.data.total_requirements ||
            res.data.total_records ||
            flattenedCount ||
            0;
          this.updateSummaryCards(res.data);
          this.applyTabFilter();
          // Apply sorting after data is loaded
          //this.sortOrders();
        } else {
          this.orders = [];
          this.total = 0;
          this.totalCount = 0;
          this.getCount = 0;
        }
      },
      error: (err) => {
        console.error("Error fetching hiring support transactions:", err);
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load orders. Please try again.",
        });
      },
    });
  }

  transformResponseData(data: any[]): any[] {
    const flatOrders: any[] = [];

    if (Array.isArray(data)) {
      data.forEach((transactionItem: any) => {
        const transaction = transactionItem.transaction;
        const requirements = transactionItem.requirements || [];

        // Each requirement becomes a row in the table
        requirements.forEach((requirement: any) => {
          flatOrders.push({
            transaction_id: transaction.transaction_id,
            requirement_id: requirement.requirement_id,
            order_id: requirement.order_id || "001",
            jobTitle: requirement.jobTitle,
            vacancies: requirement.no_of_vacancies || 0,
            talentRequirement: requirement.profilesRequired || 0,
            min_salary: requirement.min_salary,
            max_salary: requirement.max_salary,
            currency: requirement.currency,
            is_payment_completed: transaction.is_payment_completed,
            // Prefer explicit requirement-level status if present, otherwise derive from transaction
            order_status: requirement.order_status || this.getOrderStatus(transaction),
            orderStatus: requirement.order_status || this.getOrderStatus(transaction),
            payment_status: transaction.is_payment_completed,
            transaction: transaction,
            requirement: requirement,
            // Additional fields for filtering
            company_name: transaction.company_name,
            authorized_person: transaction.authorized_person,
            email: transaction.email,
            work_location: requirement.work_location_id,
            experience: requirement.experience,
            employment_type: requirement.employment_type_id,
            work_mode: requirement.work_mode,
            // Additional fields for display
            payment_link: transaction.payment_link,
            created_by: this.formatCreatedBy(requirement, transaction),
            revenue: requirement.amount || transaction.amount || 0,
            shortlist_talents:
              requirement.profilesRequired ||
              requirement.talentRequirement ||
              0,
            delivered_talents: requirement.delivered_talents || 0,
            company_id: transaction.company_id,
          });
        });
      });
    }

    return flatOrders;
  }

  getOrderStatus(transaction: any): string {
    const isPaid = transaction?.is_payment_completed === 1;
    const status = transaction?.status;

    // Paid -> Approved (can later be moved to Completed manually)
    if (isPaid) {
      return "Approved";
    }

    // Explicitly rejected by backend
    if (status === 0) {
      return "Rejected";
    }

    // Active but not yet approved
    if (status === 1) {
      return "In Review";
    }

    // Fallback for any other in-flight state
    return "In Progress";
  }

  updateSummaryCards(data: any) {
    if (!data) return;
    this.summaryCards[0].value = data.total_vacancies ?? 0;
    this.summaryCards[1].value = data.total_requirements ?? 0;
    this.summaryCards[2].value = data.total_delivered_talents ?? 0;
    this.summaryCards[3].value = data.order_status_counts?.['Completed'] ?? 0;
    this.summaryCards[4].value = data.paid_count ?? 0;
    this.summaryCards[5].value = data.paylater_count ?? 0;
    this.summaryCards[6].value = data.order_status_counts?.['In Review'] ?? 0;
    this.summaryCards[7].value = data.order_status_counts?.['Approved'] ?? 0;
    this.summaryCards[8].value = data.order_status_counts?.['Rejected'] ?? 0;
    this.summaryCards[9].value = data.order_status_counts?.['In Progress'] ?? 0;
    this.summaryCards[10].value = data.order_status_counts?.['Completed'] ?? 0;
    this.summaryCards[11].value = `INR ${data.total_revenue ?? 0}`;
  }

  selectTab(index: number) {
    this.selectedTab = index;
    this.applyTabFilter();
  }

  applyTabFilter() {
    const filter = this.summaryCards[this.selectedTab].filter;
    console.log(
      "Applying tab filter:",
      filter,
      "Total orders:",
      this.orders.length
    );

    if (filter === "all") {
      this.filteredOrders = [...this.orders];
    } else if (filter === "approved") {
      this.filteredOrders = this.orders.filter(
        (o) => (o.order_status || o.orderStatus) === "Approved"
      );
    } else if (filter === "reject") {
      this.filteredOrders = this.orders.filter(
        (o) => (o.order_status || o.orderStatus) === "Rejected"
      );
    } else if (filter === "completed") {
      this.filteredOrders = this.orders.filter(
        (o) => (o.order_status || o.orderStatus) === "Completed"
      );
    } else if (filter === "inreview") {
      // Add filter for "In Review" status
      this.filteredOrders = this.orders.filter(
        (o) => (o.order_status || o.orderStatus) === "In Review"
      );
    } else if (filter === "inprogress") {
      // Add filter for "In Progress" status
      this.filteredOrders = this.orders.filter(
        (o) => (o.order_status || o.orderStatus) === "In Progress"
      );
    } else if (filter === "paid") {
      // Filter orders where payment is completed (is_payment_completed === 1)
      this.filteredOrders = this.orders.filter(
        (o) => o.is_payment_completed === 1
      );
    } else if (filter === "paylater") {
      // Filter orders where payment is pay later (is_payment_completed === 2)
      this.filteredOrders = this.orders.filter(
        (o) => o.is_payment_completed === 2
      );
    } else if (filter === "requirements") {
      // Filter orders that have requirements (talent delivery)
      this.filteredOrders = this.orders.filter(
        (o) => o.talentRequirement && o.talentRequirement > 0
      );
    } else if (filter === "talents") {
      // Filter orders that have delivered talents
      this.filteredOrders = this.orders.filter(
        (o) => o.delivered_talents && o.delivered_talents > 0
      );
    } else if (filter === "shortlist") {
      // Filter orders that are completed
      this.filteredOrders = this.orders.filter(
        (o) => (o.order_status || o.orderStatus) === "Completed"
      );
    } else {
      this.filteredOrders = [...this.orders];
    }
    // Apply sorting after filtering
    //this.sortOrders();
    console.log("Filtered orders count:", this.filteredOrders.length);
  }

  applyFilters() {
    const f = this.hiringSupportFilterForm.value;

    // Build filter object - only include non-empty values
    const filterData: any = {};

    if (f.orderId && f.orderId.toString().trim() !== "") {
      filterData.orderId = f.orderId.toString().trim();
    }
    if (f.companyName && f.companyName.trim() !== "") {
      filterData.companyName = f.companyName.trim();
    }
    if (f.paymentStatus && f.paymentStatus !== "") {
      filterData.paymentStatus = f.paymentStatus;
    }
    if (f.revenueStatus && f.revenueStatus !== "") {
      filterData.revenueStatus = f.revenueStatus;
    }
    if (f.keyword && f.keyword.trim() !== "") {
      filterData.keyword = f.keyword.trim();
    }
    if (f.jobTitle && f.jobTitle.trim() !== "") {
      filterData.jobTitle = f.jobTitle.trim();
    }
    if (f.orderStatus && f.orderStatus !== "") {
      filterData.orderStatus = f.orderStatus;
    }

    // Always add pagination parameters
    filterData.page = this.page;
    filterData.perpage = this.pageSize;

    this.recruitmentService.getHiringSupportTransactions(filterData).subscribe({
      next: (res) => {
        if (
          res.status &&
          res.data &&
          res.data.transactions &&
          Array.isArray(res.data.transactions)
        ) {
          this.orders = this.transformResponseData(res.data.transactions);
          // Use total_requirements for the count of individual requirement records
          // If not available, use the length of flattened orders array
          const flattenedCount = this.orders.length;
          this.total =
            res.data.total_requirements ||
            res.data.total_records ||
            flattenedCount ||
            0;
          this.totalCount =
            res.data.total_requirements ||
            res.data.total_records ||
            flattenedCount ||
            0;
          this.getCount =
            res.data.total_requirements ||
            res.data.total_records ||
            flattenedCount ||
            0;
          this.updateSummaryCards(res.data);
          this.applyTabFilter();
          // Apply sorting after filtering
          //this.sortOrders();
        } else {
          this.orders = [];
          this.total = 0;
          this.totalCount = 0;
          this.getCount = 0;
        }
      },
      error: (err) => {
        console.error("Error filtering hiring support transactions:", err);
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to filter orders. Please try again.",
        });
      },
    });
  }

  resetFilters() {
    this.hiringSupportFilterForm.reset();
    this.page = 1;
    this.selectedTab = 0;
    this.getHiringSupport();
  }

  onSort(event: any) {
    this.sortField = event.field;
    this.sortOrder = event.order;
    this.sortOrders();
  }

  sortOrders() {
    if (!this.sortField) {
      return;
    }

    this.filteredOrders.sort((a: any, b: any) => {
      let valueA = a[this.sortField] || "";
      let valueB = b[this.sortField] || "";

      // Handle string comparison for Order ID
      if (typeof valueA === "string" && typeof valueB === "string") {
        valueA = valueA.toString().toLowerCase();
        valueB = valueB.toString().toLowerCase();
      }

      if (valueA < valueB) {
        return this.sortOrder === 1 ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortOrder === 1 ? 1 : -1;
      }
      return 0;
    });
  }

  refreshData() {
    // Reset to page 1 and get all data
    this.page = 1;
    this.hiringSupportFilterForm.reset();
    this.selectedTab = 0;
    this.getHiringSupport();
    this.toast.add({
      severity: "success",
      summary: "Refreshed",
      detail: "Data has been refreshed successfully",
    });
  }

  exportData() {
    const f = this.hiringSupportFilterForm.value;

    // Build filter object - only include non-empty values
    const filterData: any = { is_admin: true };

    if (f.orderId && f.orderId.toString().trim() !== "") {
      filterData.orderId = f.orderId.toString().trim();
    }
    if (f.companyName && f.companyName.trim() !== "") {
      filterData.companyName = f.companyName.trim();
    }
    if (f.paymentStatus && f.paymentStatus !== "") {
      filterData.paymentStatus = f.paymentStatus;
    }
    if (f.revenueStatus && f.revenueStatus !== "") {
      filterData.revenueStatus = f.revenueStatus;
    }
    if (f.keyword && f.keyword.trim() !== "") {
      filterData.keyword = f.keyword.trim();
    }
    if (f.jobTitle && f.jobTitle.trim() !== "") {
      filterData.jobTitle = f.jobTitle.trim();
    }
    if (f.orderStatus && f.orderStatus !== "") {
      filterData.orderStatus = f.orderStatus;
    }

    // Add tab filter if not "all"
    const filter = this.summaryCards[this.selectedTab].filter;
    if (filter !== "all") {
      if (filter === "approved") {
        filterData.orderStatus = "Approved";
      } else if (filter === "reject") {
        filterData.orderStatus = "Reject";
      } else if (filter === "completed") {
        filterData.orderStatus = "Completed";
      }
    }

    this.recruitmentService.exportHiringSupport(filterData).subscribe({
      next: (res) => {
        if (res?.status && res?.export_link) {
          // Open the download link in a new tab
          window.open(res.export_link, "_blank");
          this.toast.add({
            severity: "success",
            summary: "Export",
            detail: res?.message || "Export file is being downloaded",
          });
        } else {
          this.toast.add({
            severity: "warn",
            summary: "Export",
            detail: res?.message || "No download link received from server",
          });
        }
      },
      error: (err) => {
        console.error("Error exporting data:", err);
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail:
            err?.error?.message || "Failed to export data. Please try again.",
        });
      },
    });
  }

  viewOrder(order: any) {
    this.selectedOrder = order;
    this.isEditMode = false;
    this.orderDialogVisible = true;
    this.initializeEditForm(order);
  }

  closeOrderDialog() {
    this.orderDialogVisible = false;
    this.selectedOrder = null;
    this.isEditMode = false;
    this.paymentLink = "";
  }

  initializeEditForm(order: any) {
    const requirement = order.requirement || order;

    let workLocationIds: any[] = [];
    if (requirement.work_location_id) {
      if (Array.isArray(requirement.work_location_id)) {
        const firstItem = requirement.work_location_id[0];
        if (typeof firstItem === 'string' && isNaN(Number(firstItem))) {
          workLocationIds = requirement.work_location_id
            .map((locName: string) => {
              const location = this.workLocations.find(
                (loc: any) => loc.work_location === locName
              );
              return location ? location.id : null;
            })
            .filter((id: any) => id !== null);
          if (workLocationIds.length === 0) {
            workLocationIds = requirement.work_location_id;
          }
        } else {
          workLocationIds = requirement.work_location_id
            .filter((id: any) => id !== null && id !== undefined && id !== "")
            .map((id: any) => (typeof id === "number" ? id : parseInt(id, 10)))
            .filter((id: number) => !isNaN(id));
        }
      } else if (typeof requirement.work_location_id === "string") {
        const hasComma = requirement.work_location_id.includes(',');
        const firstPart = requirement.work_location_id.split(',')[0].trim();

        if (isNaN(Number(firstPart)) && hasComma) {
          const location = this.workLocations.find(
            (loc: any) => loc.work_location === requirement.work_location_id
          );
          if (location) {
            workLocationIds = [location.id];
          } else {
            workLocationIds = [requirement.work_location_id];
          }
        } else {
          workLocationIds = requirement.work_location_id
            .split(",")
            .map((id: string) => parseInt(id.trim(), 10))
            .filter((id: number) => !isNaN(id));
        }
      } else {
        const parsedId = parseInt(requirement.work_location_id, 10);
        if (!isNaN(parsedId)) {
          workLocationIds = [parsedId];
        }
      }
    }

    // Parse languages into FormArray
    const languagesFormGroups: FormGroup[] = [];
    const parsedLanguages = this.parseLanguagesToArray(requirement.language_skills);
    if (parsedLanguages && parsedLanguages.length > 0) {
      parsedLanguages.forEach((lang: any) => {
        const languageValue = Array.isArray(lang) ? lang[0] : (lang.language || lang);
        const proficiencyValue = Array.isArray(lang) ? lang[1] : (lang.proficiency || null);

        languagesFormGroups.push(
          this.fb.group({
            language: [languageValue || null, [Validators.required, this.duplicateLanguageValidator()]],
            proficiency: [proficiencyValue || null],
          })
        );
      });
    } else {
      languagesFormGroups.push(this.createLanguageForm());
    }
    const languagesArray = this.fb.array(languagesFormGroups);

    languagesArray.controls.forEach((control, index) => {
      (control as FormGroup).get('language')?.valueChanges.subscribe(() => {
        languagesArray.controls.forEach((ctrl, idx) => {
          if (idx !== index) {
            (ctrl as FormGroup).get('language')?.updateValueAndValidity({ emitEvent: false });
          }
        });
      });
    });

    this.editForm = this.fb.group({
      companyName: [
        order.company_name || order.transaction?.company_name || "",
        Validators.required,
      ],
      jobTitle: [requirement.jobTitle || "", Validators.required],
      orderId: [order.order_id || "", Validators.required],
      createdBy: [
        this.formatCreatedBy(requirement, order.transaction) || "",
        Validators.required,
      ],
      vacancies: [
        requirement.no_of_vacancies || requirement.vacancies || 0,
        Validators.required,
      ],
      shortlistTalents: [
        requirement.profilesRequired || requirement.talentRequirement || 0,
        Validators.required,
      ],
      employmentType: [requirement.employment_type_id || ""],
      workLocation: [workLocationIds],
      workMode: [requirement.work_mode || ""],
      experience: [requirement.experience || ""],
      salaryCurrency: [requirement.currency || "INR"],
      minSalary: [requirement.min_salary || 0, [this.salaryRangeValidator]],
      maxSalary: [requirement.max_salary || 0, [this.salaryRangeValidator]],
      startDate: [requirement.startDate || ""],
      languages: languagesArray,
      minEducation: [this.getMinEducationId(requirement)],
      orderStatus: [order.order_status || order.orderStatus || ""],
      paymentStatus: [
        this.getPaymentStatus(order),
        Validators.required,
      ],
      rolesResponsibilities: [requirement.roles_responsibilities || ""],
      notes: [requirement.remarks || ""],
      remarks: [requirement.uniprep_remarks || ""],
    });
    this.editForm.get("vacancies")?.valueChanges.subscribe((vacancies) => {
      if (vacancies && vacancies > 0) {
        const calculatedRequirement = vacancies * 3;
        this.editForm.get("shortlistTalents")?.setValue(calculatedRequirement, {
          emitEvent: false,
        });
      } else if (vacancies === null || vacancies === 0) {
        this.editForm.get("shortlistTalents")?.setValue(null, {
          emitEvent: false,
        });
      }
    });
    this.editForm.get("minSalary")?.valueChanges.subscribe(() => {
      this.editForm.get("maxSalary")?.updateValueAndValidity({ emitEvent: false });
    });
    this.editForm.get("maxSalary")?.valueChanges.subscribe(() => {
      this.editForm.get("minSalary")?.updateValueAndValidity({ emitEvent: false });
    });
  }

  parseLanguagesToArray(languageSkills: any): any[] {
    if (!languageSkills) return [];
    try {
      if (typeof languageSkills === "string") {
        const parsed = JSON.parse(languageSkills);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } else if (Array.isArray(languageSkills)) {
        return languageSkills;
      }
    } catch (e) {
      return [];
    }
    return [];
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.initializeEditForm(this.selectedOrder);
      this.initialFormValue = this.editForm.getRawValue();
    }
  }

  private getChangedFields() {
    const current = this.editForm?.getRawValue();

    if (!this.initialFormValue || !current) {
      return { changedKeys: [], statusChanged: false, normalChanged: false };
    }

    const initial = this.initialFormValue;
    const changedKeys: string[] = [];

    Object.keys(current).forEach(key => {
      const currVal = current[key];
      const initVal = initial[key];

      if (!(key in initial)) {
        return;
      }

      const currStr = JSON.stringify(currVal ?? null);
      const initStr = JSON.stringify(initVal ?? null);

      if (currStr !== initStr) {
        changedKeys.push(key);
      }
    });

    const statusChanged = changedKeys.includes('orderStatus') ||
      changedKeys.includes('paymentStatus');
    const normalChanged = changedKeys.some(k =>
      k !== 'orderStatus' && k !== 'paymentStatus'
    );
    return { changedKeys, statusChanged, normalChanged };
  }

  updateOrder() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this.toast.add({
        severity: "warn",
        summary: "Validation Error",
        detail: "Please fill all required fields.",
      });
      return;
    }

    const { statusChanged, normalChanged, changedKeys } = this.getChangedFields();
    if (changedKeys.length === 0) {
      setTimeout(() => {
        this.toast.add({
          severity: 'info',
          summary: 'No Changes',
          detail: 'No changes found.',
        });
        this.isEditMode = false;
      }, 100);
      return;
    }

    if (statusChanged && !normalChanged) {
      this.callUpdateOrderStatus();
      return;
    }

    if (!statusChanged && normalChanged) {
      this.callUpdateOrder();
      return;
    }

    if (statusChanged && normalChanged) {
      this.callUpdateOrder(() => {
        this.callUpdateOrderStatus();
      });
    }
  }

  private callUpdateOrder(afterSuccess?: () => void) {
    const updateData = this.buildUpdateRequirementPayload();
    this.recruitmentService.updateRequirement(updateData).subscribe({
      next: (res) => {
        if (res.status || res.success) {
          this.toast.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message || 'Requirement updated successfully',
          });
          afterSuccess?.();
          this.afterUpdateSuccess(res);
        }
      },
      error: () => {
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update requirement',
        });
      }
    });
  }

  private callUpdateOrderStatus() {
    const formValue = this.editForm.value;
    const payload = {
      order_id: this.selectedOrder.order_id,
      order_status: formValue.orderStatus,
      payment_status: formValue.paymentStatus,
      transaction_id: this.selectedOrder.transaction_id
    };

    this.recruitmentService.updateOrderStatus(payload).subscribe({
      next: () => {
        this.toast.add({
          severity: 'success',
          summary: 'Status Updated',
          detail: 'Order / Payment status updated successfully',
        });
        this.isEditMode = false;
        this.getHiringSupport();
      },
      error: () => {
        this.toast.add({
          severity: 'warn',
          summary: 'Partial Update',
          detail: 'Order status update failed',
        });
      }
    });
  }

  private buildUpdateRequirementPayload() {
    const formValue = this.editForm.value;

    let workLocations = formValue.workLocation;
    if (typeof workLocations === "string" && workLocations.trim()) {
      // Split by comma and trim each location
      workLocations = workLocations
        .split(",")
        .map((loc: string) => loc.trim())
        .filter((loc: string) => loc);
    } else if (!Array.isArray(workLocations)) {
      workLocations = [];
    }

    // Get company_id, transaction_id, and amount from order
    const requirement = this.selectedOrder.requirement || this.selectedOrder;
    const transaction = this.selectedOrder.transaction || this.selectedOrder;
    const companyId =
      requirement.company_id ||
      transaction.company_id ||
      this.selectedOrder.company_id;
    const transactionId =
      this.selectedOrder.transaction_id || transaction.transaction_id;
    const amount =
      requirement.amount ||
      transaction.amount ||
      this.selectedOrder.revenue ||
      this.selectedOrder.amount ||
      0;

    // Format languages - convert from FormArray format to array format
    let languagesArray = [];
    if (formValue.languages && Array.isArray(formValue.languages)) {
      languagesArray = formValue.languages
        .filter((lang: any) => lang.language && lang.proficiency)
        .map((lang: any) => {
          const langObj = this.languages.find(
            (l: any) => l.language === lang.language || l.id === lang.language
          );
          const languageName = langObj?.language || lang.language;
          return [languageName, lang.proficiency];
        });
    }

    return {
      company_id: companyId,
      transaction_id: transactionId,
      requirement_id: this.selectedOrder.requirement_id,
      jobTitle: formValue.jobTitle,
      vacancies: formValue.vacancies,
      total_requirements: formValue.shortlistTalents,
      work_type: formValue.employmentType,
      work_locations: workLocations,
      work_mode: formValue.workMode,
      experience: formValue.experience,
      currency: formValue.salaryCurrency || 'INR',
      min_salary: formValue.minSalary,
      max_salary: formValue.maxSalary,
      startDate: formValue.startDate,
      minimum_education: formValue.minEducation,
      languages: languagesArray,
      roles_responsibilities: formValue.rolesResponsibilities,
      notes: formValue.notes,
      remarks: formValue.remarks,
      amount: typeof amount === 'string' ? parseFloat(amount) : amount,
    };
  }

  private afterUpdateSuccess(res: any) {
    const formValue = this.editForm.value;

    if (res?.data?.payment_link) {
      this.paymentLink = res.data.payment_link;
      this.paymentLinkDialogVisible = true;
      navigator.clipboard.writeText(res.data.payment_link).catch(() => { });
    }

    if (this.selectedOrder) {
      const requirement = this.selectedOrder.requirement || this.selectedOrder;
      requirement.jobTitle = formValue.jobTitle;
      requirement.no_of_vacancies = formValue.vacancies;
      requirement.profilesRequired = formValue.shortlistTalents;
      requirement.employment_type_id = formValue.employmentType;
      requirement.work_mode = formValue.workMode;
      requirement.experience = formValue.experience;
      requirement.min_salary = formValue.minSalary;
      requirement.max_salary = formValue.maxSalary;
      requirement.currency = formValue.salaryCurrency || 'INR';
      requirement.startDate = formValue.startDate;
      requirement.minimum_education = Number(formValue.minEducation);
      requirement.roles_responsibilities = formValue.rolesResponsibilities;
      requirement.remarks = formValue.notes;
      requirement.uniprep_remarks = formValue.remarks;

      if (res.data?.total_amount) {
        requirement.amount = res.data.total_amount;
        this.selectedOrder.amount = res.data.total_amount;
        this.selectedOrder.revenue = res.data.total_amount;
      }

      this.selectedOrder.order_status = formValue.orderStatus;
      this.selectedOrder.payment_status = formValue.paymentStatus;
    }

    this.isEditMode = false;
    this.getHiringSupport();
  }

  generatePaymentLink() {
    if (!this.selectedOrder) {
      return;
    }

    const transactionId =
      this.selectedOrder.transaction_id ||
      this.selectedOrder.transaction?.transaction_id;
    const employerId =
      this.selectedOrder.employer_id ||
      this.selectedOrder.transaction?.employer_id ||
      this.selectedOrder.requirement?.employer_id;
    const currency =
      this.selectedOrder.currency ||
      this.selectedOrder.requirement?.currency ||
      "INR";
    const totalAmount =
      this.selectedOrder.revenue ||
      this.selectedOrder.requirement?.amount ||
      this.selectedOrder.transaction?.amount ||
      0;

    if (!transactionId) {
      this.toast.add({
        severity: "error",
        summary: "Error",
        detail: "Transaction ID not found.",
      });
      return;
    }

    if (!employerId) {
      this.toast.add({
        severity: "error",
        summary: "Error",
        detail: "Employer ID not found.",
      });
      return;
    }

    this.recruitmentService
      .generatePaymentLink({
        currency: currency,
        totalAmount: totalAmount,
        employer_id: employerId,
        transaction_id: transactionId,
      })
      .subscribe({
        next: (res) => {
          if (res.status && res.data) {
            this.paymentLink = res.data.payment_link;
            this.paymentLinkDialogVisible = true;
            // Copy to clipboard
            navigator.clipboard.writeText(res.data.payment_link).then(() => {
              this.toast.add({
                severity: "success",
                summary: "Success",
                detail:
                  res.message ||
                  "Payment link generated and copied to clipboard.",
              });
            });
            // Update the selectedOrder with the new payment link
            if (this.selectedOrder) {
              this.selectedOrder.payment_link = res.data.payment_link;
            }
          } else {
            this.toast.add({
              severity: "warn",
              summary: "Warning",
              detail: res.message || "Failed to generate payment link.",
            });
          }
        },
        error: (err) => {
          console.error("Error generating payment link:", err);
          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: err?.error?.message || "Failed to generate payment link.",
          });
        },
      });
  }

  copyPaymentLink() {
    if (this.paymentLink) {
      navigator.clipboard.writeText(this.paymentLink).then(() => {
        this.toast.add({
          severity: "success",
          summary: "Copied",
          detail: "Payment link copied to clipboard.",
        });
      });
    }
  }

  copyPaymentLinkToClipboard(link: string) {
    if (link) {
      navigator.clipboard
        .writeText(link)
        .then(() => {
          this.toast.add({
            severity: "success",
            summary: "Success",
            detail: "Payment link copied to clipboard.",
          });
        })
        .catch(() => {
          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to copy payment link.",
          });
        });
    }
  }

  formatCreatedBy(requirement: any, transaction: any): string {
    const createdBy = requirement.created_by || "";
    const isUniprep = createdBy.toLowerCase().includes("uniprep");

    if (isUniprep) {
      // Show admin details from requirement
      const parts = [];
      parts.push(requirement.created_by);
      if (requirement.admin_email) {
        parts.push(requirement.admin_email);
      }
      if (requirement.admin_name) {
        parts.push(requirement.admin_name);
      }
      if (requirement.admin_phone) {
        parts.push(requirement.admin_phone);
      }
      return parts.length > 0 ? parts.join("<br>") : createdBy || "N/A";
    } else {
      // Show employer details from transaction
      const parts = [];
      parts.push(requirement.created_by);
      if (requirement.email) {
        parts.push(requirement.email);
      }
      if (requirement.employer_name || requirement.authorized_person) {
        parts.push(requirement.employer_name || requirement.authorized_person);
      }
      if (requirement.phone) {
        parts.push(requirement.phone);
      }
      return parts.length > 0 ? parts.join("<br>") : createdBy || "N/A";
    }
  }

  parseLanguages(languageSkills: any): string {
    if (!languageSkills) return "";
    try {
      if (typeof languageSkills === "string") {
        const parsed = JSON.parse(languageSkills);
        if (Array.isArray(parsed)) {
          return parsed
            .map((lang: any[]) => `${lang[0]} (${lang[1]})`)
            .join(", ");
        }
      } else if (Array.isArray(languageSkills)) {
        return languageSkills
          .map((lang: any[]) => `${lang[0]} (${lang[1]})`)
          .join(", ");
      }
    } catch (e) {
      return languageSkills;
    }
    return "";
  }

  formatLanguages(languagesString: string): string {
    if (!languagesString) return "[]";
    try {
      // Parse format like "English (Fluent), Spanish (Proficient)"
      const pairs = languagesString.split(", ").map((pair) => {
        const match = pair.match(/^(.+?)\s*\((.+?)\)$/);
        if (match) {
          return [match[1].trim(), match[2].trim()];
        }
        return [pair.trim(), ""];
      });
      return JSON.stringify(pairs);
    } catch (e) {
      return "[]";
    }
  }

  getLanguages(order: any): string {
    const requirement = order.requirement || order;
    return this.parseLanguages(requirement.language_skills);
  }

  getEmploymentType(order: any): string {
    const requirement = order.requirement || order;
    if (requirement.employment_type_id) {
      return requirement.employment_type_id;
    }
    return "N/A";
  }

  getMinEducation(order: any): string {
    const requirement = order.requirement || order;
    const minEduId = requirement.minimum_education;

    if (!minEduId || minEduId === '' || minEduId === 'null') return "N/A";

    let edu = this.minimumEducation.find(e => e.id === Number(minEduId));

    if (!edu) {
      edu = this.minimumEducation.find(e =>
        e.minimum_education?.toLowerCase() === String(minEduId).toLowerCase()
      );
    }
    return edu ? edu.minimum_education : minEduId;
  }

  getMinEducationId(requirement: any): number | null {
    const minEdu = requirement.minimum_education;

    if (!minEdu || minEdu === '' || minEdu === 'null') {
      return null;
    }
    const numValue = Number(minEdu);
    if (!isNaN(numValue) && numValue > 0) {
      return numValue;
    }
    if (typeof minEdu === 'string') {
      const edu = this.minimumEducation.find(e =>
        e.minimum_education?.toLowerCase() === minEdu.toLowerCase()
      );
      return edu ? edu.id : null;
    }

    return null;
  }

  getRolesResponsibilities(order: any): string {
    const requirement = order.requirement || order;
    return requirement.roles_responsibilities || "";
  }

  getNotes(order: any): string {
    const requirement = order.requirement || order;
    return requirement.remarks || "";
  }

  getUniprepRemarks(order: any): string {
    const requirement = order.requirement || order;
    return requirement.uniprep_remarks || "";
  }

  getSanitizedHtml(html: string): SafeHtml {
    if (!html) return this.sanitizer.bypassSecurityTrustHtml("");
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getJobStartDate(order: any): string {
    const requirement = order.requirement || order;
    if (requirement.startDate) {
      return requirement.startDate;
    }
    return "N/A";
  }

  getPaymentStatus(order: any): number {
    const transaction = order.transaction || order;
    const paymentStatus = transaction.is_payment_completed;

    if (paymentStatus === 1 || paymentStatus === true) {
      return 1;
    } else if (paymentStatus === 2) {
      return 2;
    }
    return 0;
  }

  getWorkType(order: any): string {
    // Check requirement object first
    if (order.requirement?.work_type) {
      if (Array.isArray(order.requirement.work_type)) {
        return order.requirement.work_type.join(", ");
      }
      return order.requirement.work_type;
    }
    // Check employment_type which might contain work type info
    if (order.employment_type) {
      return order.employment_type;
    }
    return "N/A";
  }

  getWorkMode(order: any): string {
    // Check direct property first
    if (order.work_mode) {
      if (Array.isArray(order.work_mode)) {
        return order.work_mode.join(", ");
      }
      return order.work_mode;
    }
    // Check requirement object
    if (order.requirement?.work_mode) {
      if (Array.isArray(order.requirement.work_mode)) {
        return order.requirement.work_mode.join(", ");
      }
      return order.requirement.work_mode;
    }
    return "N/A";
  }

  getJobLocation(order: any): string {
    const requirement = order.requirement || order;

    // Check if work_location_id is an array of location strings (from API)
    if (
      requirement.work_location_id &&
      Array.isArray(requirement.work_location_id)
    ) {
      // If it's an array of strings (like ["Pune, India"]), join them
      if (
        requirement.work_location_id.length > 0 &&
        typeof requirement.work_location_id[0] === "string"
      ) {
        return requirement.work_location_id.join(", ");
      }
      // If it's an array of IDs, find the location names
      const locations = requirement.work_location_id
        .map((locId: any) => {
          const location = this.workLocations.find(
            (loc: any) => loc.id === locId || loc.work_location === locId
          );
          return location?.work_location || locId;
        })
        .filter((loc: string) => loc);
      return locations.length > 0 ? locations.join(", ") : "N/A";
    }

    // Check work_location property
    if (requirement.work_location) {
      return requirement.work_location;
    }

    // Check work_locations array
    if (
      requirement.work_locations &&
      Array.isArray(requirement.work_locations)
    ) {
      return requirement.work_locations.join(", ");
    }

    // Check order level work_location
    if (order.work_location) {
      if (Array.isArray(order.work_location)) {
        return order.work_location.join(", ");
      }
      return order.work_location;
    }

    return "N/A";
  }

  getExperienceLevel(order: any): string {
    // Check direct property first
    if (order.experience) {
      return order.experience;
    }
    // Check requirement object
    if (order.requirement?.experience) {
      return order.requirement.experience;
    }
    return "N/A";
  }

  formatRevenue(order: any): string {
    const revenue =
      order.revenue ||
      order.requirement?.amount ||
      order.transaction?.amount ||
      0;
    const currency = order.currency || order.requirement?.currency || "INR";
    return `${currency} ${parseFloat(revenue).toFixed(2)}`;
  }

  formatSalaryRange(order: any): string {
    const requirement = order.requirement || order;
    const minSalary = requirement.min_salary || order.min_salary;
    const maxSalary = requirement.max_salary || order.max_salary;
    const currency = requirement.currency || order.currency || "INR";

    if (minSalary && maxSalary) {
      return `${currency} ${this.formatSalary(minSalary)} - ${this.formatSalary(
        maxSalary
      )}`;
    } else if (minSalary) {
      return `${currency} ${this.formatSalary(minSalary)}`;
    }
    return "N/A";
  }

  formatSalary(amount: number | string): string {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(num)) return "0";
    // Format with commas for thousands
    return num.toLocaleString("en-IN");
  }

  getStatusClass(status: string): string {
    const statusLower = (status || "").toLowerCase();

    // Match existing SCSS classes: status-approved, status-reject, status-review, status-process
    if (statusLower.includes("approved")) {
      return "status-approved";
    }
    if (statusLower.includes("rejected") || statusLower.includes("reject")) {
      return "status-reject";
    }
    if (statusLower.includes("review")) {
      return "status-review";
    }
    // Treat in-progress / completed / others as generic process style
    if (statusLower.includes("progress") || statusLower.includes("completed")) {
      return "status-process";
    }

    return "status-process";
  }

  getStatusClassPayment(status: number | string | boolean): string {
    // Handle numeric values: 0 = unpaid, 1 = paid, 2 = pay later
    if (typeof status === "number") {
      switch (status) {
        case 1:
          return "status-paid";
        case 2:
          return "status-pay-later";
        default:
          return "status-pending";
      }
    }

    // Handle boolean values
    if (typeof status === "boolean") {
      return status ? "status-paid" : "status-pending";
    }

    // Handle string values
    if (typeof status === "string") {
      const statusLower = status.toLowerCase();
      if (statusLower === "paid" || statusLower.includes("1") || statusLower === "received") {
        return "status-paid";
      } else if (
        statusLower === "pay later" ||
        statusLower === "pay-later" ||
        statusLower.includes("2")
      ) {
        return "status-pay-later";
      } else if (statusLower === "pending" || statusLower === "unpaid" || statusLower.includes("0")) {
        return "status-pending";
      }
    }

    return "status-pending";
  }

  currentSortFieldHiring: string | null = null;
  currentSortOrderHiring: number = 1;
  currentFirstHiring: number = 0;
  @ViewChild('dtHiring') tableHiring: any; 

  onPageChange(event: any) {
    const isSortToggle =
      event.sortField === this.currentSortFieldHiring &&
      event.sortOrder !== this.currentSortOrderHiring &&
      event.first === 0 &&
      this.currentFirstHiring !== 0;

    if (isSortToggle) {
      event.first = this.currentFirstHiring;
    }

    this.currentSortFieldHiring = event.sortField;
    this.currentSortOrderHiring = event.sortOrder;
    this.currentFirstHiring = event.first;

    this.page = (event.first / event.rows) + 1;
    this.pageSize = event.rows;

    // Get current filter values
    const f = this.hiringSupportFilterForm.value;
    const filterData: any = {
      page: this.page,
      perpage: this.pageSize,
    };

    // Add filters if they exist
    if (f.orderId && f.orderId.toString().trim() !== "") {
      filterData.orderId = f.orderId.toString().trim();
    }
    if (f.companyName && f.companyName.trim() !== "") {
      filterData.companyName = f.companyName.trim();
    }
    if (f.paymentStatus && f.paymentStatus !== "") {
      filterData.paymentStatus = f.paymentStatus;
    }
    if (f.revenueStatus && f.revenueStatus !== "") {
      filterData.revenueStatus = f.revenueStatus;
    }
    if (f.keyword && f.keyword.trim() !== "") {
      filterData.keyword = f.keyword.trim();
    }
    if (f.jobTitle && f.jobTitle.trim() !== "") {
      filterData.jobTitle = f.jobTitle.trim();
    }
    if (f.orderStatus && f.orderStatus !== "") {
      filterData.orderStatus = f.orderStatus;
    }

    this.recruitmentService.getHiringSupportTransactions(filterData).subscribe({
      next: (res) => {
        if (
          res.status &&
          res.data &&
          res.data.transactions &&
          Array.isArray(res.data.transactions)
        ) {
          this.orders = this.transformResponseData(res.data.transactions);
          if (this.currentSortFieldHiring) {
            this.orders.sort((a, b) => {
              let aValue = a[this.currentSortFieldHiring!];
              let bValue = b[this.currentSortFieldHiring!];

              if (aValue == null) aValue = '';
              if (bValue == null) bValue = '';

              if (typeof aValue === 'string') aValue = aValue.toLowerCase();
              if (typeof bValue === 'string') bValue = bValue.toLowerCase();

              let result = 0;
              if (aValue < bValue) result = -1;
              else if (aValue > bValue) result = 1;

              return this.currentSortOrderHiring * result;
            });
          }

          // Use total_requirements for the count of individual requirement records
          // If not available, use the length of flattened orders array
          const flattenedCount = this.orders.length;
          this.total =
            res.data.total_requirements ||
            res.data.total_records ||
            flattenedCount ||
            0;
          this.totalCount =
            res.data.total_requirements ||
            res.data.total_records ||
            flattenedCount ||
            0;
          this.getCount =
            res.data.total_requirements ||
            res.data.total_records ||
            flattenedCount ||
            0;
          this.updateSummaryCards(res.data);
          this.applyTabFilter();
          if (isSortToggle && this.tableHiring) {
            setTimeout(() => {
              this.tableHiring.first = this.currentFirstHiring;
            }, 0);
          }
        } else {
          this.orders = [];
          this.total = 0;
          this.totalCount = 0;
          this.getCount = 0;
        }
      },
      error: (err) => {
        console.error("Error fetching paginated data:", err);
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load page. Please try again.",
        });
      },
    });
  }

  getPaymentStatusText(status: number | string | boolean): string {
    // Handle numeric values: 0 = unpaid, 1 = paid, 2 = pay later
    if (typeof status === "number") {
      switch (status) {
        case 1:
          return "Paid";
        case 2:
          return "Pay Later";
        default:
          return "Unpaid";
      }
    }

    // Handle boolean values
    if (typeof status === "boolean") {
      return status ? "Paid" : "Unpaid";
    }

    // Handle string values
    const statusLower = (status || "").toLowerCase();
    if (statusLower === "paid" || statusLower.includes("1")) {
      return "Paid";
    } else if (
      statusLower === "pay later" ||
      statusLower === "pay-later" ||
      statusLower.includes("2")
    ) {
      return "Pay Later";
    } else if (statusLower === "unpaid" || statusLower.includes("0")) {
      return "Unpaid";
    }

    return "Unpaid";
  }

  // ==================== View Mapped Talents ====================

  viewTalents(order: any) {
    this.selectedOrderForTalents = order;
    this.viewTalentsDialogVisible = true;
    this.loadMappedTalents(order);
  }

  loadMappedTalents(order: any) {
    if (!order) {
      return;
    }

    this.isLoadingTalents = true;
    this.mappedTalents = [];

    // Extract company_id and order_id from order object
    // Order structure from transformResponseData: { order_id, requirement: { company_id }, transaction: { company_id } }
    const companyId =
      order.requirement?.company_id ||
      order.transaction?.company_id ||
      order.company_id;
    const orderId = order.order_id;

    if (!companyId || !orderId) {
      this.isLoadingTalents = false;
      this.toast.add({
        severity: "error",
        summary: "Error",
        detail: "Missing company ID or order ID",
      });
      return;
    }

    const apiPayload = {
      company_id: companyId,
      order_id: orderId,
    };

    this.recruitmentService.getMappedTalents(apiPayload).subscribe({
      next: (res: any) => {
        this.isLoadingTalents = false;
        if (
          res?.status &&
          res?.data?.talents &&
          Array.isArray(res.data.talents)
        ) {
          this.mappedTalents = res.data.talents;
        } else {
          this.mappedTalents = [];
          this.toast.add({
            severity: "info",
            summary: "No Talents",
            detail: "No mapped talents found for this order",
          });
        }
      },
      error: (err: any) => {
        this.isLoadingTalents = false;
        this.mappedTalents = [];
        console.error("Error fetching mapped talents:", err);
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: err?.error?.message || "Failed to load mapped talents",
        });
      },
    });
  }

  closeViewTalentsDialog() {
    this.viewTalentsDialogVisible = false;
    this.mappedTalents = [];
    this.selectedOrderForTalents = null;
  }

  salaryRangeValidator = (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent) {
      return null;
    }

    const minSalary = parent.get("minSalary")?.value;
    const maxSalary = parent.get("maxSalary")?.value;

    if (
      minSalary === null ||
      minSalary === undefined ||
      maxSalary === null ||
      maxSalary === undefined
    ) {
      return null;
    }

    const min = Number(minSalary);
    const max = Number(maxSalary);

    if (min >= max) {
      return {
        salaryRangeInvalid: {
          message: "Minimum salary must be less than maximum salary",
        },
      };
    }

    if (min < 0 || max < 0) {
      return {
        salaryRangeInvalid: {
          message: "Salary values cannot be negative",
        },
      };
    }

    return null;
  };
  duplicateLanguageValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const parentFormArray = control.parent?.parent as FormArray;
      if (!parentFormArray) {
        return null;
      }

      const currentLanguage = control.value;
      const currentIndex = parentFormArray.controls.findIndex(
        (ctrl) => (ctrl as FormGroup).get("language") === control
      );

      for (let i = 0; i < parentFormArray.length; i++) {
        if (i !== currentIndex) {
          const otherLanguage = (parentFormArray.at(i) as FormGroup).get(
            "language"
          )?.value;
          if (otherLanguage === currentLanguage) {
            return { duplicateLanguage: true };
          }
        }
      }

      return null;
    };
  }

  createLanguageForm(): FormGroup {
    const form = this.fb.group({
      language: [null, [Validators.required, this.duplicateLanguageValidator()]],
      proficiency: [null],
    });

    // Re-validate other language fields when this one changes
    form.get("language")?.valueChanges.subscribe(() => {
      const parentFormArray = form.parent as FormArray;
      if (parentFormArray) {
        const currentIndex = parentFormArray.controls.indexOf(form);
        parentFormArray.controls.forEach((control, index) => {
          if (index !== currentIndex) {
            (control as FormGroup)
              .get("language")
              ?.updateValueAndValidity({ emitEvent: false });
          }
        });
      }
    });

    return form;
  }

  getAvailableLanguages(languageIndex: number): any[] {
    const languagesArray = this.getLanguagesArray();
    const selectedLanguages: string[] = [];

    languagesArray.controls.forEach((control, index) => {
      if (index !== languageIndex) {
        const selectedLang = control.get("language")?.value;
        if (selectedLang) {
          selectedLanguages.push(selectedLang);
        }
      }
    });

    return this.languages.filter(
      (lang) => !selectedLanguages.includes(lang.language)
    );
  }
}
