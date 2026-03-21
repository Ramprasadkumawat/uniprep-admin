import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdvisorChatService } from './advisor-chat.service';
import { MessageService } from 'primeng/api';
@Component({
    selector: 'uni-advisor-chat',
    templateUrl: './advisor-chat.component.html',
    styleUrls: ['./advisor-chat.component.scss'],
    standalone: false
})
export class AdvisorChatComponent implements OnInit {
  totalquestions: number = 0;
  tabIndex: number = 0;
  chatLists:any = [];
  unrepliedChats: any = [];
  chatUserName: string = "";
  messages: any = [];
  textMessage: string = "";
  modules: any;
  replyButtonVisiblity: boolean = false;
  selectedQuestionData: any;
  totalReplied: number = 0;
  totalUnreplied: number = 0;

  constructor(
    private AdvisorService: AdvisorChatService,
    private toast: MessageService,
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
      },
    };
   }

  ngOnInit(): void {
    this.getExpertsHistory();
  }

  getExpertsHistory(){
    this.AdvisorService.getChatHistory().subscribe(response =>{
      this.chatLists = response.data;
      this.totalReplied = response.total_replied;
      this.totalUnreplied = response.total_unreplied;
      this.totalquestions = response.total_questions;
      this.unrepliedChats = this.chatLists.filter(item => item.replied_count !== 0);
    });
  }

  checkboxchange(event: any, messageData: any){
    let replyMessageData = {
      message_id: messageData.id,
      reply_user_id: messageData.userid,
      question_updated_time: messageData.updated_at
    }
    this.selectedQuestionData = replyMessageData;
    this.replyButtonVisiblity = event.target.checked;
  }

  loadUserChat(users: any){
    this.chatUserName = users.name;
    this.AdvisorService.getUsersMessages(users.userid).subscribe(res =>{
      this.messages = res;
      this.textMessage = "";
      this.replyButtonVisiblity = false;
    })
  }

  sendMessage(){
    let insertingData = {
      question_id: this.selectedQuestionData.message_id,
      replying_for_id: this.selectedQuestionData.reply_user_id,
      reply_message: this.textMessage,
      update_time: this.selectedQuestionData.question_updated_time //i need to show the question and answer order so i sent.if i am not sent the data i  need to write another one query.
    }

    this.AdvisorService.storeExpertReply(insertingData).subscribe(res => {
      this.getExpertsHistory();
      let userId = {
        userid: this.selectedQuestionData.reply_user_id,
        name: this.chatUserName,
      }
      this.loadUserChat(userId);
      this.toast.add({severity: "success", summary: "Success", detail: res.message});
    })
  }
}
