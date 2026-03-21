import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { InputTextModule } from "primeng/inputtext";
import {TabsModule} from 'primeng/tabs';
import { TableModule } from "primeng/table";
import { AccordionModule } from "primeng/accordion";
import {SelectModule} from "primeng/select";
import { TextareaModule } from "primeng/textarea";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { ChathistoryService } from "./chathistory.service";
import { AuthService } from "src/app/Auth/auth.service";
import { MessageService } from "primeng/api";
import { Users } from "src/app/@Models/chat.model";
import { EditorModule } from "primeng/editor";
import { MultiSelectModule } from "primeng/multiselect";
import { PageFacadeService } from "../../page-facade.service";
import { DatePickerModule } from 'primeng/datepicker';
import screenfull from "screenfull";
import { BadgeModule } from "primeng/badge";
import { FileUploadModule } from "primeng/fileupload";
import { DialogModule } from "primeng/dialog";
import { TooltipModule } from "primeng/tooltip";
import { PopoverModule } from 'primeng/popover';
import { ChipModule } from "primeng/chip";

@Component({
    selector: "uni-chathistory",
    templateUrl: "./chathistory.component.html",
    styleUrls: ["./chathistory.component.scss"],
    imports: [
        CommonModule,
        InputTextModule,
        TabsModule,
        TableModule,
        AccordionModule,
        SelectModule,
        TextareaModule,
        ReactiveFormsModule,
        CardModule,
        ButtonModule,
        FormsModule,
        EditorModule,
        MultiSelectModule,
        DatePickerModule,
        BadgeModule,
        FileUploadModule,
        DialogModule,
        TooltipModule,
        PopoverModule,
        ChipModule,
    ]
})
export class ChathistoryComponent implements OnInit {
  @HostListener("fullscreenchange", ["$event"])
  fullscreenchange(event: any) {
    if (!screenfull.isFullscreen) {
      this.screensize = "pi-window-maximize";
      this.fullscreen = "";
    }
  }
  @ViewChild("fullscreeneditor") editorelement: ElementRef;
  modules = {};
  uploadedFiles: any[] = [];
  visibility = false;
  onUpload(event: any) {
    this.uploadedFiles = [];
    for (let file of event.target.files) {
      this.uploadedFiles.push(file);
    }
  }
  fullscreen = "";
  Chatlists: any[] = [];
  SkippedChatlists: any[] = [];
  NotrepliedChatlists: any[] = [];
  ReportChatlists: any[] = [];
  messages: any = [];
  userDetail: any = [];
  chatUserName: string = "";
  chatUserId: number = 0;
  textMessage: string = "";
  selectedQuestion: number = 0;
  toSend: boolean = false;
  chatUserQuestionLeft: number = 0;
  chatUserChatLimit: number = 0;
  selectedIndex: any;
  currentUserId: any;
  msgActive: boolean = true;
  msgDeactive: boolean = false;
  filterForm: FormGroup;
  countryList: any[] = [];
  leadList: any[] = [];
  statusList: any[] = [];
  constructor(
    private service: ChathistoryService,
    private authService: AuthService,
    private toast: MessageService,
    private fb: FormBuilder,
    private pageService: PageFacadeService
  ) {
    this.modules = {
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike"], // toggled buttons
          ["blockquote", "code-block"],

          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }], // superscript/subscript
          [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
          [{ direction: "rtl" }], // text direction
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ align: [] }],
          ["clean"], // remove formatting button
          ["link", "image", "video"], // link and image, video
          // ["fullscreen"],
        ],
        handlers: {
          emoji: function () {},
          attachmentHandler: () => {
            this.visibility = !this.visibility;
          },
          fullscreen: () => {
            if (screenfull.isEnabled) {
              this.fullscreen = this.fullscreen ? "" : "fullscreen";
              screenfull.toggle(this.editorelement.nativeElement);
            }
          },
        },
      },
    };
    this.filterForm = fb.group({
      createdFrom: [""],
      createdTo: [""],
      country: [""],
      leadtype: [""],
      messagestatus: [""],
    });
  }
  screensize = "pi-window-maximize";
  fullscreentoggle() {
    if (screenfull.isEnabled) {
      this.fullscreen = this.fullscreen ? "" : "fullscreen";
      if (this.fullscreen == "fullscreen") {
        this.screensize = "pi-window-minimize";
      } else {
        this.screensize = "pi-window-maximize";
      }
      screenfull.toggle(this.editorelement.nativeElement);
    }
  }
  ngOnInit(): void {
    this.getchatList();
    this.getnonrepliedchatList();
    this.getskippedchatList();
    this.getCountryList();
    this.getreportchatList();
    this.getLeadList();
    this.userDetail = this.authService.user;
    this.statusList = [
      { id: null, name: "Select" },
      { id: 1, name: "Not Replied" },
      { id: 2, name: "Skipped" },
      { id: 3, name: "Reported" },
    ];
  }
  selectedTab: number = 0;
  tabIndex: number = 0;
  getcurrenttab(event: any) {
    this.selectedTab = event?.index;
    this.tabIndex = event?.index;
  }
  getLeadList() {
    this.service.getleadtype().subscribe((response) => {
      console.log(response, "leadtype");
      this.leadList = [{ id: null, name: "Select" }, ...response];
    });
  }
  getCountryList() {
    this.pageService.getCountries().subscribe((response) => {
      this.countryList = response;
    });
  }
  data: any = {};
  filtersubmit() {
    const formData = this.filterForm.value;
    if (formData.messagestatus != null && formData.messagestatus != "") {
      this.tabIndex = this.filterForm.value.messagestatus;
      this.selectedIndex = this.tabIndex;
    }
    formData.country = formData.country.toString();
    formData.createdFrom =
      typeof formData.createdFrom == "string"
        ? formData.createdFrom
        : formData.createdFrom.toLocaleDateString("en-CA");
    formData.createdTo =
      typeof formData.createdTo == "string"
        ? formData.createdTo
        : formData.createdTo.toLocaleDateString("en-CA");
    this.data.country = formData.country;
    this.data.createdFrom = formData.createdFrom;
    this.data.createdTo = formData.createdTo;
    this.data.leadtype = formData.leadtype;
    this.data.messagestatus = formData.messagestatus;
    this.getchatList();
    this.getnonrepliedchatList();
    this.getskippedchatList();
    this.getreportchatList();
  }
  searchdata = "";
  searchinputchange() {
    if (this.searchdata.length != 0) {
      this.NotrepliedChatlists = this.NotrepliedChatlists.filter(
        (data) =>
          data.name.toLowerCase().includes(this.searchdata.toLowerCase()) ||
          data.email.toLowerCase().includes(this.searchdata.toLowerCase())
      );
      this.SkippedChatlists = this.SkippedChatlists.filter(
        (data) =>
          data.name.toLowerCase().includes(this.searchdata.toLowerCase()) ||
          data.email.toLowerCase().includes(this.searchdata.toLowerCase())
      );
      this.ReportChatlists = this.ReportChatlists.filter(
        (data) =>
          data.name.toLowerCase().includes(this.searchdata.toLowerCase()) ||
          data.email.toLowerCase().includes(this.searchdata.toLowerCase())
      );
      this.Chatlists = this.Chatlists.filter(
        (data) =>
          data.name.toLowerCase().includes(this.searchdata.toLowerCase()) ||
          data.email.toLowerCase().includes(this.searchdata.toLowerCase())
      );
    }
  }
  reset() {
    this.searchdata = "";
    this.data = {};
    this.filterForm.reset();
    this.getchatList();
    this.getnonrepliedchatList();
    this.getskippedchatList();
    this.getCountryList();
    this.getreportchatList();
    this.getLeadList();
    this.userDetail = this.authService.user;
  }
  totalchatusers = 0;
  totalquestions = 0;
  totalansweres = 0;
  totalnonansweres = 0;

  totalnonrepliedchatusers = 0;
  totalnonrepliedquestions = 0;
  totalnonrepliedansweres = 0;

  totalskippedchatusers = 0;
  totalskippedquestions = 0;
  totalskippedansweres = 0;

  totalquestionsanswered = 0;
  totalquestionsasked = 0;
  questionsleft = 0;

  totalreportchatusers = 0;
  totalreportquestions = 0;
  totalreportansweres = 0;

  totalchatsbadge = "";
  totalnonrepliedbadge = "";
  totalskippedbadge = "";
  totalreportbadge = "";

  getchatList() {
    this.service.getChatList(this.data).subscribe((response) => {
      this.Chatlists = response.userlist;
      this.totalchatusers = response.totalusers;
      this.totalquestions = response.totalquestions;
      this.totalansweres = response.totalanswered;
      this.totalnonansweres = response.totalnonanswered;
    });
  }
  getnonrepliedchatList() {
    this.service.getnonrepliedChatList(this.data).subscribe((response) => {
      this.NotrepliedChatlists = response.userlist;
      this.totalnonrepliedchatusers = response.totalusers;
      this.totalnonrepliedquestions = response.totalquestions;
      this.totalnonrepliedansweres = response.totalanswered;
    });
  }
  getskippedchatList() {
    this.service.getskippedChatList(this.data).subscribe((response) => {
      this.SkippedChatlists = response.userlist;
      this.totalskippedchatusers = response.totalusers;
      this.totalskippedquestions = response.totalquestions;
      this.totalskippedansweres = response.totalanswered;
    });
  }
  getreportchatList() {
    this.service.getchatreportlist(this.data).subscribe((response) => {
      this.ReportChatlists = response.userlist;
      this.totalreportchatusers = response.totalusers;
      this.totalreportquestions = response.totalquestions;
      this.totalreportansweres = response.totalanswered;
    });
  }
  loadUserChat(user: Users) {
    this.chatUserId = user.id;
    this.chatUserName = user.name;
    this.chatUserQuestionLeft = user.questions_left;
    this.chatUserChatLimit = user.chatlimit;
    this.getChatHistoryByUserId(user.id);
  }
  getChatHistoryByUserId(id: number) {
    this.service
      .getChatHistoryByUser({ chatuserid: id })
      .subscribe((response) => {
        this.messages = response.messages;
        this.totalquestionsasked = response?.totalquestionsasked;
        this.totalquestionsanswered = response?.totalquestionsanswered;
        this.questionsleft = response?.questionsleft;
      });
  }

  checkboxchange(event: any, index: number, questionNumber: number) {
    this.selectedIndex = event.target.checked ? index : undefined;
    this.toSend = event.target.checked;
    this.selectedQuestion = questionNumber;
  }
  sendmessageLoading = false;
  sendMessage() {
    this.sendmessageLoading = true;
    if (this.textMessage == "" && this.uploadedFiles.length == 0) {
      this.toast.add({
        severity: "error",
        summary: "Error",
        detail: "Not allowed to send empty Message !",
      });
      this.sendmessageLoading=false;
      return;
    }
    if (this.toSend) {
      let data = {
        message: this.textMessage,
        user_id: this.chatUserId,
        selectedQuestion: this.selectedQuestion,
      };
      this.service
        .sendChatMessage(data, this.uploadedFiles)
        .subscribe((response) => {
          if (response?.success == false) {
            this.toast.add({
              severity: "error",
              summary: "Error",
              detail: response.message,
            });
            this.sendmessageLoading=false;
            return;
          }
          this.textMessage = "";
          this.uploadedFiles = [];
          this.toSend = false;
          this.getchatList();
          this.getnonrepliedchatList();
          this.getskippedchatList();
          this.getreportchatList();
          this.getChatHistoryByUserId(this.chatUserId);
          this.sendmessageLoading=false;
          this.toast.add({
            severity: "success",
            summary: "Success",
            detail: "Message Replied",
          });
        });
    } else {
      this.sendmessageLoading=false;
      this.toast.add({
        severity: "error",
        summary: "Error",
        detail: "Please make sure you have select any question!",
      });
    }
  }
  openAttachment(url: any) {
    window.open(url);
  }
  clearFiles() {
    this.uploadedFiles = [];
  }
}
