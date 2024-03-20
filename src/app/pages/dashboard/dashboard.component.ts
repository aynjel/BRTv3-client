import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { convertToDateStr } from 'src/app/config/dateStr';
import { storage } from 'src/app/config/storage';
import { assetsUrl, currentDate } from 'src/app/constants/constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  readonly barGraph = assetsUrl + 'btn_right.svg';
  readonly lineGraph = assetsUrl + 'btn_left.svg';
  readonly goToRoutes = assetsUrl + 'btn_goto.svg';
  readonly routesPath = '/dashboard/routes';
  readonly busCategory = [
    {
      path: '',
      label: 'All Buses',
      imgUrl: assetsUrl + 'bus_all.svg',
    },
    {
      path: 'active',
      label: 'Active',
      imgUrl: assetsUrl + 'bus_active.svg',
    },
    {
      path: 'inactive',
      label: 'Inactive',
      imgUrl: assetsUrl + 'bus_inactive.svg',
    },
  ];

  intervalDate: Subscription;

  isLoading: boolean = true;
  isError: boolean = false;
  dailyAnalyticsMessage: string = 'Fetching Daily analytics';
  routeStopsMessage: string = 'Fetching Route stops';

  lineGraphView = true;
  date: Date = currentDate;
  dateStr: string;

  constructor(private router: Router) {
    this.intervalDate = interval(1000).subscribe(() => {
      this.date = new Date();
    });

    this.dateStr = convertToDateStr(currentDate);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.intervalDate) this.intervalDate.unsubscribe();
  }

  switchGraph() {
    this.isLoading = true;
    this.lineGraphView = !this.lineGraphView;
  }

  fetchComplete(event: boolean) {
    this.isLoading = event;
  }

  redirectToBuses(path: string) {
    const busPage = '/dashboard/buses';
    if (!path) {
      this.router.navigate([busPage]);
      return;
    }

    this.router.navigate([busPage], { queryParams: { type: path } });
  }
}
