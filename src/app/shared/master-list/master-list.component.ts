import { Component, ViewChild } from '@angular/core';
import { MasterList } from 'src/app/models/masterlist.model';
import { MasterListTableNav } from 'src/app/models/table.model';
import { MasterListTooltipComponent } from '../tooltip/master-list-tooltip/master-list-tooltip.component';
import { Personnel } from 'src/app/models/personnel.model';

@Component({
  selector: 'app-master-list',
  templateUrl: './master-list.component.html',
  styleUrls: ['./master-list.component.scss']
})
export class MasterListComponent {
  @ViewChild('tooltip') tooltip!: MasterListTooltipComponent;

  readonly tableNav: MasterListTableNav[] = [
    {
      name: 'PAO',
      value: 'pao',
      type: 'PAO',
      headers: ['Name', 'License', 'Violation Code', 'Violation Details', 'Date Issued']
    },
    {
      name: 'DRIVER',
      value: 'driver',
      type: 'Driver',
      headers: ['Name', 'License', 'Violation Code', 'Violation Details', 'Date Issued']
    },
    {
      name: 'POS',
      value: 'imei',
      type: 'POS',
      headers: ['IMEI', 'Date Enrolled', 'Assigned Operator', 'Status']
    },
    {
      name: 'SALES',
      value: 'sales',
      type: 'Sales',
      headers: ['Month', 'PAO', 'Sales']
    },
    {
      name: 'VIOLATION',
      value: 'violation',
      type: 'Violation',
      headers: ['Name', 'PAO/Driver', 'No. of Violations', 'Recent Violation', 'Date Issued']
    },
  ];
  // readonly tableFormat: MasterListTableFormat[] = [
  //   {
  //     type: 'PAO',
  //     headers: ['Name', 'License', 'Violation Code', 'Violation Details', 'Date Issued']
  //   },
  //   {
  //     type: 'Driver',
  //     headers: ['Name', 'License', 'Violation Code', 'Violation Details', 'Date Issued']
  //   },
  //   {
  //     type: 'POS',
  //     headers: ['IMEI', 'Date Enrolled', 'Assigned Operator', 'Status']
  //   },
  //   {
  //     type: 'Sales',
  //     headers: ['Month', 'PAO', 'Sales']
  //   },
  //   {
  //     type: 'Violation',
  //     headers: ['Name', 'PAO/Driver', 'No. of Violations', 'Recent Violation', 'Date Issued']
  //   },
  // ];

  activeTable: MasterListTableNav = this.tableNav[0];
  // activeTableFormat: MasterListTableFormat = this.tableFormat[0];
  masterList: MasterList = {
    'PAO': [

    ],
    'Driver': [

    ],
    'POS': [
      {
        IMEI: 987654321,
        enrolled: new Date(),
        status: 'ACTIVE'
      }
    ],
    'Sales': [
      {
        month: new Date(),
        PAO: 'irving',
        sales: 12345
      }
    ],
    'Violation': [
      {
        name: 'Irving',
        position: 'DRIVER',
        violationCount: 1,
        violationMsg: 'Allowing another person to use another driver\'s license',
        issued: new Date()
      }
    ],
  };

  tooltipContent?: Personnel;

  constructor () { }

  setActiveTable(nav: MasterListTableNav) {
    // this.activeTable = nav;

    this.activeTable = this.tableNav.find(table => table.type === nav.type)!;
  }

  onRowHover(event: MouseEvent, data: Personnel) {
    this.tooltipContent = data;
    this.tooltip.show(data);
  }

  onRowLeave() {
    this.tooltip.hide();
  }
}
