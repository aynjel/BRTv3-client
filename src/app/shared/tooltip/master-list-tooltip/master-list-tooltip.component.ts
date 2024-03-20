import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MasterList } from 'src/app/models/masterlist.model';
import { Personnel } from 'src/app/models/personnel.model';

@Component({
  selector: 'app-master-list-tooltip',
  templateUrl: './master-list-tooltip.component.html',
  styleUrls: ['./master-list-tooltip.component.scss']
})
export class MasterListTooltipComponent implements OnInit {
  @Input() content?: Personnel;
  visible: boolean = false;

  show(content: Personnel) {
    this.content = content;
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  ngOnInit(): void {
  }
}
