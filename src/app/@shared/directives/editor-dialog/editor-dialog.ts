import {Component, Input, OnInit} from "@angular/core";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
    selector: 'uni-dashboard',
    templateUrl: './editor-dialog.html',
    styleUrls: ['./editor-dialog.scss'],
    standalone: false
})
export class EditorDialog{

    options: string[] = [];
    constructor(private config: DynamicDialogConfig, private ref: DynamicDialogRef) { }
    ngOnInit(): void {
        this.options = this.config.data.options;
    }
    select(val: string) {
        this.ref.close(val);
    }
}