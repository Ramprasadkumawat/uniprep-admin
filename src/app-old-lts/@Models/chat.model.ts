export interface ChatsByUsers {
    success: boolean;
    userlist: Users[];
}

export interface Users {
    id: number;
    name: string;
    email: string;
    phone: string;
    subscription_plan: string;
    chatlimit: number;
    questions_left: number;
}

export interface ChatsByUser {
    success: boolean;
    messages: User[];
    totalquestionsasked:number;
    totalquestionsanswered:number;
    questionsleft:number;
  }
  
  export interface User {
    id: number;
    send_by: number;
    to_user_id: any;
    admin_message: number;
    answerForQuestion: any;
    message: string;
    status: number;
    messageStatus: number;
    created_at: string;
    updated_at: string;
    sendByName: string;
    questionNumber: number;
  }

  export interface SendMessage {
    success: boolean
    message: string
  }

  export interface SendMessageParams {
    message: string;
    user_id: number;
    selectedQuestion: number;
  }