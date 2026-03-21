import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { GenralreportService } from "../genralreport/genralreport.service";
import { CommonModule } from "@angular/common";
import { AccordionModule } from "primeng/accordion";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { SelectModule } from "primeng/select";
import { DatePickerModule } from "primeng/datepicker";

@Component({
	selector: "uni-reportsysetemchat",
	templateUrl: "./reportsysetemchat.component.html",
	styleUrls: ["./reportsysetemchat.component.scss"],
	imports: [CommonModule, AccordionModule, InputTextModule, TableModule, ButtonModule, SelectModule, ReactiveFormsModule, DatePickerModule, FormsModule],
})
export class ReportsysetemchatComponent implements OnInit {
	form: FormGroup;
	submitForm: FormGroup;
	chatform: any = FormGroup;
	chatSelectingUserName: any = "name";
	activeButton: number = 1;
	statusList: any[] = [];
	chatreportuser: any[] = [];
	ticketlistforchat: any[] = [];
	getChatList: any[] = [];
	buttonNumber: number = 0;
	constructor(private router: Router, private fb: FormBuilder, private genralreport: GenralreportService) {
		this.form = this.fb.group({
			title: [""],
			decription: [""],
			image: [""],
			tutorialsid: [""],
		});
		this.submitForm = this.fb.group({
			status: ["", [Validators.required]],
			textarea: ["", [Validators.required]],
		});
	}

	ngOnInit(): void {
		this.statusList = [
			{ id: 1, name: "Action" },
			{ id: 0, name: "Not-Action" },
		];
		this.redirectTochat();
	}
	redirectTochat() {
		this.buttonNumber = parseInt(localStorage.getItem("reportmoduleidforchat"));
		this.button1Style = {
			"background-color": "#FFFFFF",
			color: "#000000",
		};

		this.button2Style = {
			"background-color": "#FFFFFF",
			color: "#000000",
		};
		this.button3Style = {
			"background-color": "#FFFFFF",
			color: "#000000",
		};

		this.button4Style = {
			"background-color": "#FFFFFF",
			color: "#000000",
		};
		this.button5Style = {
			"background-color": "#FFFFFF",
			color: "#000000",
		};
		this.button6Style = {
			"background-color": "#FFFFFF",
			color: "#000000",
		};
		this.button7Style = {
			"background-color": "#FFFFFF",
			color: "#000000",
		};
		// Set styles for the clicked button
		if (this.buttonNumber === 1) {
			this.activeButton = 1;
			this.button1Style = {
				"background-color": "var(--p-primary-500)",
				color: "#FFFFFF",
			};
			this.rportIdforparam = 1;
			this.GetReportCatWise();
		} else if (this.buttonNumber === 2) {
			this.activeButton = 2;
			this.button2Style = {
				"background-color": "var(--p-primary-500)",
				color: "#FFFFFF",
			};
			this.rportIdforparam = 2;
			this.GetReportCatWise();
		} else if (this.buttonNumber === 3) {
			this.activeButton = 3;
			this.button3Style = {
				"background-color": "var(--p-primary-500)",
				color: "#FFFFFF",
			};
			this.rportIdforparam = 3;
			this.GetReportCatWise();
		} else if (this.buttonNumber === 4) {
			this.activeButton = 4;
			this.button4Style = {
				"background-color": "var(--p-primary-500)",
				color: "#FFFFFF",
			};
			this.rportIdforparam = 4;
			this.GetReportCatWise();
		} else if (this.buttonNumber === 5) {
			this.activeButton = 5;
			this.button5Style = {
				"background-color": "var(--p-primary-500)",
				color: "#FFFFFF",
			};
			this.rportIdforparam = 5;
			this.GetReportCatWise();
		} else if (this.buttonNumber === 6) {
			this.activeButton = 6;
			this.button6Style = {
				"background-color": "var(--p-primary-500)",
				color: "#FFFFFF",
			};
			this.rportIdforparam = 6;
			this.GetReportCatWise();
		} else if (this.buttonNumber === 7) {
			this.activeButton = 7;
			this.button7Style = {
				"background-color": "var(--p-primary-500)",
				color: "#FFFFFF",
			};
			this.rportIdforparam = 7;
			this.GetReportCatWise();
		} else if (this.buttonNumber === 8) {
			this.activeButton = 8;
			this.button8Style = {
				"background-color": "var(--p-primary-500)",
				color: "#FFFFFF",
			};
			this.rportIdforparam = 8;
			this.GetReportCatWise();
		}
		this.ticketchatuserid = parseInt(localStorage.getItem("useridforchatreport"));
		this.chatticketno = localStorage.getItem("ticketnoforchat");
		this.chatTicketInUser(this.ticketchatuserid, this.activeButton);
		this.tickWiseChatList(this.ticketchatuserid, this.chatticketno);
	}
	onFilterSubmit() {}
	resetFilter() {}
	sendMessage() {
		this.markFormGroupTouched(this.submitForm);
		if (this.submitForm.valid) {
			var data = {
				ticket_no: this.chatticketno,
				status: this.submitForm.value.status,
				reply_message: this.submitForm.value.textarea,
			};
			this.genralreport.submitChat(data).subscribe((response) => {
				this.getChatList = response.data;
			});
		}
	}
	markFormGroupTouched(formGroup: FormGroup) {
		Object.values(formGroup.controls).forEach((control) => {
			if (control instanceof FormGroup) {
				this.markFormGroupTouched(control);
			} else {
				control.markAsTouched();
			}
		});
	}
	// Button styles
	button1Style = {
		"background-color": "#FFFFFF",
		color: "#000000",
	};

	button2Style = {
		"background-color": "#FFFFFF",
		color: "#000000",
	};
	button3Style = {
		"background-color": "#FFFFFF",
		color: "#000000",
	};

	button4Style = {
		"background-color": "#FFFFFF",
		color: "#000000",
	};
	button5Style = {
		"background-color": "#FFFFFF",
		color: "#000000",
	};
	button6Style = {
		"background-color": "#FFFFFF",
		color: "#000000",
	};
	button7Style = {
		"background-color": "#FFFFFF",
		color: "#000000",
	};
	button8Style = {
		"background-color": "#FFFFFF",
		color: "#000000",
	};
	rportIdforparam: any;
	setActiveButton(buttonNumber: number): void {
		this.ticketchatuserid = null;
		this.button1Style = {
			"background-color": "#FFFFFF",
			color: "#000000",
		};

		this.button2Style = {
			"background-color": "#FFFFFF",
			color: "#000000",
		};
		this.button3Style = {
			"background-color": "#FFFFFF",
			color: "#000000",
		};

		this.button4Style = {
			"background-color": "#FFFFFF",
			color: "#000000",
		};
		this.button5Style = {
			"background-color": "#FFFFFF",
			color: "#000000",
		};
		this.button6Style = {
			"background-color": "#FFFFFF",
			color: "#000000",
		};
		this.button7Style = {
			"background-color": "#FFFFFF",
			color: "#000000",
		};
		this.button8Style = {
			"background-color": "#FFFFFF",
			color: "#000000",
		};
		// Set styles for the clicked button
		if (buttonNumber === 1) {
			this.activeButton = 1;
			this.button1Style = {
				"background-color": "var(--p-primary-500)",
				color: "#FFFFFF",
			};
			this.rportIdforparam = 1;
			this.GetReportCatWise();
		} else if (buttonNumber === 2) {
			this.activeButton = 2;
			this.button2Style = {
				"background-color": "var(--p-primary-500)",
				color: "#FFFFFF",
			};
			this.rportIdforparam = 2;
			this.GetReportCatWise();
		} else if (buttonNumber === 3) {
			this.activeButton = 3;
			this.button3Style = {
				"background-color": "var(--p-primary-500)",
				color: "#FFFFFF",
			};
			this.rportIdforparam = 3;
			this.GetReportCatWise();
		} else if (buttonNumber === 4) {
			this.activeButton = 4;
			this.button4Style = {
				"background-color": "var(--p-primary-500)",
				color: "#FFFFFF",
			};
			this.rportIdforparam = 4;
			this.GetReportCatWise();
		} else if (buttonNumber === 5) {
			this.activeButton = 5;
			this.button5Style = {
				"background-color": "var(--p-primary-500)",
				color: "#FFFFFF",
			};
			this.rportIdforparam = 5;
			this.GetReportCatWise();
		} else if (buttonNumber === 6) {
			this.activeButton = 6;
			this.button6Style = {
				"background-color": "var(--p-primary-500)",
				color: "#FFFFFF",
			};
			this.rportIdforparam = 6;
			this.GetReportCatWise();
		} else if (buttonNumber === 7) {
			this.activeButton = 7;
			this.button7Style = {
				"background-color": "var(--p-primary-500)",
				color: "#FFFFFF",
			};
			this.rportIdforparam = 7;
			this.GetReportCatWise();
		} else if (buttonNumber === 8) {
			this.activeButton = 8;
			this.button8Style = {
				"background-color": "var(--p-primary-500)",
				color: "#FFFFFF",
			};
			this.rportIdforparam = 8;
			this.GetReportCatWise();
		}
	}
	GetReportCatWise() {
		this.getChatList = [];
		this.ticketlistforchat = [];
		let data = {
			type: this.rportIdforparam,
		};
		this.genralreport.GetReportCatWise(data).subscribe((response) => {
			this.chatreportuser = response.data;
			this.porteluserbeforfilter = response.data;
		});
	}
	ticketchatuserid: any;
	chatTicketInUser(userid: any, ticktype: any, listname?) {
		this.chatSelectingUserName = listname
		this.getChatList = [];
		this.ticketlistforchat = [];
		this.ticketchatuserid = userid;
		console.log(this.ticketchatuserid);
		let data = {
			type: ticktype,
			user_id: userid,
		};
		this.genralreport.GetReportTicketWise(data).subscribe((response) => {
			this.ticketlistforchat = response.data;
		});
	}
	chatticketno: any;
	tickWiseChatList(userid: any, ticketno: any) {
		this.chatticketno = ticketno;
		var data = {
			ticket_no: ticketno,
			user_id: userid,
		};
		this.genralreport.getChatFromTickets(data).subscribe((response) => {
			this.getChatList = response.chat;
		});
	}
	searchdata = "";
	porteluserbeforfilter = [];
	performSearch(): void {
		if (this.searchdata.length != 0) {
			this.chatreportuser = this.chatreportuser.filter((data) => data.name.toLowerCase().includes(this.searchdata.toLowerCase()) || data.email.toLowerCase().includes(this.searchdata.toLowerCase()));
		} else {
			this.chatreportuser = this.porteluserbeforfilter;
		}
	}
}
