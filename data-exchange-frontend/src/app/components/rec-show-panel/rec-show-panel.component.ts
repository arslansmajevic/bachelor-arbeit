import {Component, Input} from '@angular/core';
import {CustomPanel} from "../../dtos/nodes/node";

@Component({
  selector: 'app-rec-show-panel',
  templateUrl: './rec-show-panel.component.html',
  styleUrl: './rec-show-panel.component.css'
})
export class RecShowPanelComponent {

  @Input() panel: CustomPanel = {};

  panelsEmpty(): boolean {
    return this.panel.subPanels === undefined;
  }

}
