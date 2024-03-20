import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { convertToDateStr } from 'src/app/config/dateStr';
import { generateRandomTime } from 'src/app/config/randomNumber';
import { assetsUrl, currentDate } from 'src/app/constants/constants';
import { BusDetails, BusRoutes } from 'src/app/models/bus.model';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-bus-routes',
  templateUrl: './bus-routes.component.html',
  styleUrls: ['./bus-routes.component.scss'],
})
export class BusRoutesComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  readonly busCountIcon = assetsUrl + 'statistics_bus.svg';
  readonly moreBuses = assetsUrl + 'routes_more_options.svg';
  readonly busIcons = [
    {
      name: '< 15 min',
      path: assetsUrl + 'bus_light_blue.svg',
    },
    {
      name: '> 15 min',
      path: assetsUrl + 'bus_green.svg',
    },
    {
      name: '> 30 min',
      path: assetsUrl + 'bus_yellow.svg',
    },
    {
      name: '> 1 hr',
      path: assetsUrl + 'bus_orange.svg',
    },
    {
      name: 'EOS',
      path: assetsUrl + 'bus_violet.svg'
    },
    {
      name: 'No Route',
      path: assetsUrl + 'bus_red.svg',
    },
  ];

  isLoading: boolean = true;
  isError: boolean = false;
  statusMessage: string = 'Fetching Routes';
  errorMessage: string = '';

  date: Date;
  currentPage: number = 0;
  itemsPerPage: number = 2;
  routePagination: { [key: number]: { currentPage: number; }; } = {};

  busRoutes: BusRoutes[] = [];

  constructor (private location: Location, private router: Router, private httpService: HttpService, private activatedRoute: ActivatedRoute) {
    this.date = new Date(this.activatedRoute.snapshot.params['date'] ?? convertToDateStr(currentDate));
  }

  ngOnInit(): void {
    this.getRoutes();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getRoutes() {
    this.isError = false;
    this.isLoading = true;

    const params = {
      date: convertToDateStr(this.date),
    };

    this.httpService.get('buses/routes', params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          const busRoutes = response.data as BusRoutes[];

          if (!busRoutes.length) {
            this.isError = true;
            this.errorMessage = 'No Routes found';
            return;
          }

          this.busRoutes = busRoutes;
          this.initializeRoutePagination();

        }, error: (error) => {
          console.error(error);
          this.isError = true;
          this.errorMessage = error.error?.message || error.message || 'Error fetching Routes';
        }, complete: () => {
          this.isLoading = false;
        }
      });
  }

  private initializeRoutePagination() {
    this.busRoutes.forEach((_, index) => {
      this.routePagination[index] = { currentPage: 0 };
    });
  }

  paginatedBuses(routeIndex: number): BusDetails[] {
    const startIndex =
      this.routePagination[routeIndex].currentPage * this.itemsPerPage;
    return this.busRoutes[routeIndex].buses.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  nextBuses(index: number) {
    const totalPages = Math.ceil(
      this.busRoutes[index].buses.length / this.itemsPerPage
    );
    this.routePagination[index].currentPage =
      (this.routePagination[index].currentPage + 1) % totalPages;
  }

  gotoRouteDetails(routeCode: string) {
    if (!routeCode) return;

    this.router.navigate(['dashboard/routes', routeCode]);
  }

  goback() {
    this.location.back();
  }

  returnToDashboard() {
    this.router.navigate(['../']);
  }
}
