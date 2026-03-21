import {NgModule} from "@angular/core";
import {AvatarComponent} from "./avatar/avatar.component";
import {ResultAccordionComponent} from "./result-accordion/result-accordion.component";
import {AccordionModule} from "primeng/accordion";
import {CommonModule, NgForOf, NgSwitchCase} from "@angular/common";
import {TooltipModule} from "primeng/tooltip";

@NgModule({
    declarations: [AvatarComponent, ResultAccordionComponent],
    imports: [CommonModule, AccordionModule, NgForOf, NgSwitchCase, TooltipModule],
    exports: [AvatarComponent, ResultAccordionComponent]
})
export class SharedComponents {}