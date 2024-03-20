import { LabelType, Options } from '@angular-slider/ngx-slider';
import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  effect,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { Subject, interval, takeUntil } from 'rxjs';
import { TBusDTO, TBusModel } from 'src/app/models/bus.model';
import { HttpService } from 'src/app/services/http.service';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-timelapse',
  templateUrl: './timelapse.component.html',
  styleUrls: ['./timelapse.component.scss'],
})
export class TimelapseComponent implements OnInit, OnDestroy {
  private map: mapboxgl.Map | null = null;

  dateParams = this.activatedRoute.snapshot.params['date'];

  busInitials: TBusDTO = {
    checked: true,
    list: [],
    branchID: '',
  };
  timeRangeInitials = [0, 96];

  busesList = signal<TBusDTO[]>([]);
  busTransactions = signal<TBusModel[]>([]);

  timeArray = this.createTimeArray();

  selectedTimeRange = signal<number[]>([
    this.timeRangeInitials[0],
    this.timeRangeInitials[1],
  ]);

  minValue = signal(this.timeRangeInitials[0]);
  maxValue = signal(this.timeRangeInitials[1]);
  options = signal<Options>({
    floor: 0,
    ceil: 96,
    step: 1,
    showTicks: true,
    showTicksValues: true,
    tickStep: 4,
    noSwitching: true,
    keyboardSupport: true,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          this.selectedTimeRange.set([value, this.selectedTimeRange()[1]]);
          return this.timeArray[value];
        case LabelType.High:
          this.selectedTimeRange.set([this.selectedTimeRange()[0], value]);
          return this.timeArray[value];
        default:
          return '';
      }
    },
  });
  isPlaying = signal(false);

  isLoading: boolean = true;
  isError: boolean = false;
  statusMessage: string = 'Getting Map';
  errorMessage: string = '';

  private unsubscribe$ = new Subject<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private mapService: MapService,
    private http: HttpService
  ) {
    effect(() => {
      this.setMarkers();
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.isError = false;
    this.statusMessage = 'Getting Map';

    this.mapService.create('timelapse-map').then(mapContainer => {
      if (!mapContainer) {
        this.isError = true;
        this.errorMessage = 'No container found';
        return;
      }

      this.map = mapContainer;

      this.map.on('load', () => {
        this.map?.resize();
        this.getTimelapseData();
      });
    });
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.unsubscribe$.next();
  }

  getTimelapseData() {
    this.isLoading = true;
    this.isError = false;
    this.statusMessage = 'Getting Timelapse Data';

    this.http
      .get('map/timelapse', { date: this.dateParams })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          this.isLoading = false;
          this.statusMessage = 'Data Loaded';

          const buses = response.data as TBusDTO[];

          if (!buses.length) {
            this.isError = true;
            this.errorMessage = 'No data found';
            return;
          }

          this.busesList.set(buses);

          const busList = buses.map(bus => bus.list).flat();
          this.busTransactions.set(busList);
          console.log(busList);
        },
        error: error => {
          this.isLoading = false;
          this.isError = true;
          this.errorMessage = error;
        },
      });
  }

  setMarkers(): void {
    if (!this.busTransactions().length || !this.map) return;

    const filteredTransactions = this.filterTransactionsByTime();
    console.log(
      this.timeArray[this.selectedTimeRange()[0]],
      this.timeArray[this.selectedTimeRange()[1]],
      filteredTransactions
    );
    if (!filteredTransactions.length) return;

    // Extract coordinates and create markers
    const markers = this.createMarkers(filteredTransactions);

    // Fit map bounds to marker locations
    this.fitMapToBounds(markers);
  }

  filterTransactionsByTime(): TBusModel[] {
    const selectedRange = this.selectedTimeRange();
    return this.busTransactions().filter(transaction => {
      const time = new Date(transaction.transactDate).getHours();
      return time >= selectedRange[0] && time <= selectedRange[1];
    });
  }

  createMarkers(transactions: TBusModel[]): mapboxgl.Marker[] {
    return transactions.map(transaction => {
      const coords = JSON.parse(transaction.coordinates);

      const div = document.createElement('div');
      div.className = 'marker';
      div.style.width = '10px';
      div.style.height = '10px';
      div.style.borderRadius = '50%';
      div.style.backgroundColor = 'red';

      const marker = new mapboxgl.Marker({ element: div })
        .setLngLat([coords.longitude, coords.latitude])
        .setPopup(
          new mapboxgl.Popup().setHTML(this.createPopupContent(transaction))
        )
        .addTo(this.map!);

      return marker;
    });
  }

  createPopupContent(transaction: TBusModel): string {
    return `
      <div class="bus-popup">
        <h3>${transaction.IMEI}</h3>
        <p>Outlet: ${transaction.branchID}</p>
        <p>Pax: ${transaction.pax}</p>
        <p>Total Amt: ${transaction.totalAmount}</p>
        <p>Txn Date: ${transaction.transactDate}</p>
        <p>Route Code: ${transaction.routeCode}</p>
      </div>
    `;
  }

  fitMapToBounds(markers: mapboxgl.Marker[]) {
    const lngs = markers.map(marker => marker.getLngLat().lng);
    const lats = markers.map(marker => marker.getLngLat().lat);

    const south = Math.min(...lngs);
    const west = Math.min(...lats);
    const north = Math.max(...lngs);
    const east = Math.max(...lats);

    this.map?.fitBounds(
      [
        [south, west],
        [north, east],
      ],
      {
        padding: 20,
      }
    );
  }

  playPauseTimelapse() {
    this.isPlaying.set(!this.isPlaying());
    if (this.isPlaying()) {
      this.options.set({ ...this.options(), readOnly: true });
      this.playTimelapse();
    } else {
      this.options.set({ ...this.options(), readOnly: false });
      this.unsubscribe$.next();
    }
  }

  playTimelapse() {
    const interval$ = interval(500);
    const timeRange = this.selectedTimeRange();
    let currentTime = timeRange[0];

    interval$.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: () => {
        if (this.isPlaying()) {
          if (currentTime === timeRange[1]) {
            currentTime = timeRange[0];
          } else {
            currentTime++;
          }

          this.minValue.set(currentTime);
        } else {
          this.unsubscribe$.next();
        }
      },
    });
  }

  createTimeArray(): string[] {
    const timeArray = [];
    let hours = 0;
    let minutes = 0;
    let meridiem = 'AM';

    for (let i = 0; i < 96; i++) {
      let formattedHours = hours;

      if (formattedHours >= 12) {
        meridiem = 'PM';
        if (formattedHours > 12) formattedHours = formattedHours - 12;
      }

      if (formattedHours === 0) formattedHours = 12;

      timeArray.push(
        `${formattedHours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')} ${meridiem}`
      );
      minutes += 15;

      if (minutes === 60) {
        hours++;
        minutes = 0;
      }
    }

    timeArray.push('11:59 PM');

    return timeArray;
  }

  navigateBack() {
    this.router.navigate(['historical']);
  }
}
