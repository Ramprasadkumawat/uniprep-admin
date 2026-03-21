import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class SocialShareService {

  constructor( private toast: MessageService) { }
    socialMediaList: { [key: string]: string } = {
    "Whatsapp": "whatsapp://send?text=",
    "Instagram": "https://www.instagram.com?url=",
    "Facebook": "https://www.facebook.com/sharer/sharer.php?u=",
    "LinkedIn": "https://www.linkedin.com/shareArticle?url=",
    "Twitter": "https://twitter.com/intent/tweet?url=",
    "Mail": "mailto:?body=",
  }

  copyQuestion(textToCopy: string, msg?: string) {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        this.toast.add({ severity: 'success', summary: 'Success', detail: msg ?? 'Question Copied' });
      })
      .catch((err) => {
        this.toast.add({ severity: "error", summary: "Warning", detail: 'Failed to copy the question' });
        console.error('Failed to copy text: ', err);
      });
  }
}
