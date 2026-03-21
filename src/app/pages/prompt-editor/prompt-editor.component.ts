import { Component, OnInit } from '@angular/core';
import { PromptEditorService } from './prompt-editor.service';
import { ConfirmationService, MessageService } from 'primeng/api';
interface CurentVariables{
  name: string; 
  value: string; 
  userValue: string
}
@Component({
    selector: 'uni-prompt-editor',
    templateUrl: './prompt-editor.component.html',
    styleUrls: ['./prompt-editor.component.scss'],
    standalone: false
})
export class PromptEditorComponent implements OnInit {
  currentVariableList: CurentVariables[] = []; 
  promptText: string = "";
  isFullscreen: boolean = false;
  responseText: string = '';
  moduleNameList: any[] = [];
  currentModuleMode: string = '';

  constructor(
    private promptService: PromptEditorService,
    private toaster: MessageService,
    private confirmation: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.getModulesandPrompts();
  }
  getModulesandPrompts(){
    this.promptService.getPromptsAndModules().subscribe({
      next: response =>{
        this.moduleNameList = response;
      }
    })
  }
  
  moduleChange(event: any) {
    this.responseText = "";
    const selectedModule = event.value;
    this.currentModuleMode = selectedModule.mode;
    this.currentVariableList = JSON.parse(selectedModule.available_variables);
    this.promptText = selectedModule.prompt;
  }

  toggleFullscreen() {
    if(!this.currentModuleMode){
      this.toaster.add({severity: 'error', summary: 'Error', detail: "Please Choose the Module..!"});
      return;
    }
    this.isFullscreen = !this.isFullscreen;
  }

  copyVariable(variable: string) {
    navigator.clipboard.writeText(variable).then(() => {
      this.toaster.add({severity: 'success', summary: 'Success', detail: "Variable Copied..!"});
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }

  checkResponse() {
    if(this.currentModuleMode){
      const updatedPrompt = this.replaceVariables();
      this.promptService.getGPTResponse({ prompt: updatedPrompt, mode: "admin" }).subscribe({
        next: res =>{
          this.responseText = res.response;
          this.removeExtraContent(this.responseText);
          this.toaster.add({severity: 'success', summary: 'Success', detail: "Response Generated...!"});
        },error: error =>{
          this.toaster.add({severity: 'error', summary: 'Error', detail: error});
        }
      });
    }else{
      this.toaster.add({severity: 'error', summary: 'Error', detail: "Please Choose the Module"});
    }
  }
  
  removeExtraContent(responseHtml: string){
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = responseHtml;
    const container = tempDiv.querySelector('.container');
    if (container) {
      const extractedContent = container.outerHTML; // Store separately
      this.responseText = extractedContent;
      // Use extractedContent as needed without modifying this.responseText
    } else {
      console.log('No container found in the response!');
    }
  }

  replaceVariables(){
    let variables = this.currentVariableList || [];
    let prompt = this.promptText || '';
    variables.forEach(({ value, userValue}) =>{
      if(userValue && userValue.trim() !== ''){
        //adding backslash(\) because we are using dollar($) symbol.so the replace variable replace is not working properly.so we add like this \{ \$country \}
        const escaptedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
        prompt = prompt.replace(new RegExp(escaptedValue, 'g'), userValue)
      }
    });
    return prompt;
  }

  updatePrompts(event: any){
    if(this.currentModuleMode){
      this.confirmation.confirm({
        target: event.target as EventTarget,
        message: "Are you sure to update the prompt? ",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          
          let parms: any = {
            prompt: this.promptText,
            mode: this.currentModuleMode
          }
          this.promptService.updatePrompt(parms).subscribe({
            next: respo =>{
              this.toaster.add({severity: 'success', summary: 'Success', detail: "Response Updated...!"});
            }
          })
        },
        reject: () => {
          this.toaster.add({ severity: "error", summary: "Rejected", detail: "You have rejected", });
        },
      });
    }else{
      this.toaster.add({severity: 'error', summary: 'Error', detail: "Please Choose the Module"});
    }
  }
}
