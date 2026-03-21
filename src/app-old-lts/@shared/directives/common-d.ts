import {NgModule} from "@angular/core";
import {EditorDirective} from "./editor.directive";
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {EditorDialog} from "./editor-dialog/editor-dialog";
import {NgForOf} from "@angular/common";
@NgModule({
    declarations: [EditorDirective, EditorDialog],
    imports: [DynamicDialogModule, NgForOf],
    exports: [EditorDirective, EditorDirective]
})
export class SharedDirectives {}