import { DatePipe } from '@angular/common';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Subject, Subscription, catchError, interval, takeUntil, throwError } from 'rxjs';
import { identifyBusColor } from 'src/app/config/busColor';
import { assetsUrl, currentDate } from 'src/app/constants/constants';
import { BusLocations, MapMarker } from 'src/app/models/map.model';
import { MapService } from 'src/app/services/map.service';
import { SseService } from 'src/app/services/sse.service';

const translateDateTime = (datePipe: DatePipe, date: Date) => datePipe.transform(date, 'h:mm a') || '-';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private selectedColor: string = '';
  private map!: mapboxgl.Map;

  busCategory = [
    {
      name: '< 15 min',
      path: assetsUrl + 'bus_light_blue.svg',
      key: 'blue',
      count: 0,
    },
    {
      name: '> 15 min',
      path: assetsUrl + 'bus_green.svg',
      key: 'green',
      count: 0,
    },
    {
      name: '> 30 min',
      path: assetsUrl + 'bus_yellow.svg',
      key: 'yellow',
      count: 0,
    },
    {
      name: '> 1 hr',
      path: assetsUrl + 'bus_orange.svg',
      key: 'orange',
      count: 0,
    },
    {
      name: 'No Route',
      path: assetsUrl + 'bus_red.svg',
      key: 'red',
      count: 0,
    },
  ];
  totalBuses: number = 0;
  busMarkers: MapMarker = {};

  intervalDate: Subscription;
  date: Date = currentDate;

  // spinner
  isLoading: boolean = true;
  isError: boolean = false;
  statusMessage: string = 'Getting Map';
  errorMessage: string = '';

  constructor (private sseService: SseService, private mapService: MapService, private zone: NgZone, private datePipe: DatePipe) {
    this.intervalDate = interval(1000).subscribe(() => {
      this.date = new Date();
    });
  }

  ngOnInit(): void {
    this.mapService.create('map').then((mapContainer) => {
      if (!mapContainer) {
        this.isError = true;
        this.errorMessage = 'No container found';
        return;
      }

      this.map = mapContainer;

      this.map.on('load', () => {
        this.map.resize();
        this.mapService.geolocateControls.trigger();

        this.getBusLocations();
      });
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.sseService.disconnect();

    if (this.intervalDate) this.intervalDate.unsubscribe();
  }

  getBusLocations() {
    this.isLoading = true;
    this.statusMessage = 'Fetching bus locations';

    this.sseService
      .connect('map/locations')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          const busLocations = response.data as BusLocations[];

          this.totalBuses = busLocations.length;
          this.isLoading = false;

          this.setBusMarkers(busLocations, this.busMarkers);
          // this.mapService.setMarkers(this.map, busLocations, this.busMarkers);

        }, error: (error) => {
          this.isLoading = false;
          console.error(error);
          this.isError = true;
          this.errorMessage = error.error?.message || error.message || 'Error fetching bus locations';
        }, complete: () => {
          this.isLoading = false;
        }
      });
  }

  setBusMarkers(busLocations: BusLocations[], busMarkers: MapMarker) {

    // Remove markers that do not exist in the response
    // this.mapService.removeMarkers(this.map, busLocations, busMarkers);
    Object.keys(busMarkers).forEach(key => {
      const findBus = busLocations.find(bus => bus.ID === Number(key));
      if (findBus) return;

      const [marker, lngLat] = busMarkers[key];

      marker.getElement().removeEventListener('click', this.mapService.easeToClick(this.map, lngLat));
      marker.remove();
      delete busMarkers[key];
    });

    this.busCategory.forEach(category => category.count = 0);
    busLocations.forEach(bus => {
      const coordinates = JSON.parse(bus.coordinates);
      const { longitude, latitude } = coordinates;

      const lng = Number(longitude);
      const lat = Number(latitude);

      const lastTransact = translateDateTime(this.datePipe, bus.lastTransact);
      const lastGPS = translateDateTime(this.datePipe, bus.lastGPSUpdate);
      const className = identifyBusColor(bus);

      this.busCategory.find(category => category.key === className)!.count++;
      const popup: mapboxgl.Popup = new mapboxgl.Popup({ maxWidth: '100%', offset: [0, -30] });
      const html = `<div class="bus-popup ${className}">
      <div>
        <p>Last Transaction:</p>
        <strong>${lastTransact || '-'}</strong>
      </div>
      <div>
        <p>Last GPS sent:</p>
        <strong>${lastGPS || '-'}</strong>
      </div>
      <hr>
      <div>
        <p>Bus:</p>
        <strong>${bus.branchID || '-'}</strong>
      </div>
      <div>
        <p>IMEI:</p>
        <strong>${bus.IMEI || '-'}</strong>
      </div>
      <div>
        <p>Route:</p>
        <strong>${bus.routeName || '-'}</strong>
      </div>
      <hr>
      <div>
        <p>PAO:</p>
        <strong>${bus.PAO || '-'}</strong>
      </div>
      <div>
        <p>Contact #:</p>
        <strong>${bus.contact || '-'}</strong>
      </div>
    </div>`;

      // Update the marker location if already exists
      if (busMarkers[bus.ID]) {
        const [marker, lngLat] = busMarkers[bus.ID];
        marker.getElement().removeEventListener('click', this.mapService.easeToClick(this.map, lngLat));

        const popupElement = marker.getPopup();
        if (popupElement.isOpen()) {
          popupElement.setHTML(html);
          this.map.easeTo({
            center: [lng, lat],
            offset: [0, -30]
          });
        }

        marker.getElement().innerHTML = `<div class="bus-marker ${className}"></div>`;
        marker
          .setLngLat([lng, lat]);

        marker.getElement().addEventListener('click', this.mapService.easeToClick(this.map, [lng, lat]));
        return;
      }

      //  Add a new Marker
      const busMarker = new mapboxgl.Marker()
        .setPopup(popup.setHTML(html))
        .setLngLat([lng, lat])
        .addTo(this.map);

      busMarker.getElement().addEventListener('click', this.mapService.easeToClick(this.map, [lng, lat]));
      busMarker.getElement().innerHTML = `<div class="bus-marker ${className}"></div>`;
      busMarkers[bus.ID] = [busMarker, [lng, lat]];
    });
  }

  // Click on the bus icons on the menu, if the icon has been clicked, it should filter out the buses
  filterBusColor(key: string) {
    console.log(key);

  }
}
