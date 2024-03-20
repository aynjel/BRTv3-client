import { Injectable, computed, signal } from '@angular/core';
import environment from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';
import {
  BusLocations,
  MapMarker,
  TransactionLocation,
} from '../models/map.model';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { TBusDTO, TBusModel } from '../models/bus.model';
import { Subject, interval, takeUntil } from 'rxjs';

type Locations = BusLocations | TransactionLocation;
@Injectable({
  providedIn: 'root',
})
export class MapService {
  map: mapboxgl.Map | undefined;
  // private style = 'mapbox://styles/mapbox/streets-v12';
  private style = environment.production
    ? 'mapbox://styles/mapbox/streets-v12'
    : 'mapbox://styles/mapbox/dark-v11';

  // Cebu City as default coordinates
  lat = 10.321063;
  lng = 123.899937;
  zoom = 15;

  geolocateControls = new mapboxgl.GeolocateControl({
    // positionOptions: {
    //   enableHighAccuracy: true
    // },
    showAccuracyCircle: true,
    showUserLocation: true,
    // trackUserLocation: true
  });

  navigationControls = new mapboxgl.NavigationControl({
    showCompass: true,
    showZoom: true,
    visualizePitch: true,
  });

  constructor() {}

  create(container: string): Promise<mapboxgl.Map | null> {
    // generates the map to the browser
    return new Promise(resolve => {
      const mapElement = document.getElementById(container);
      if (!container || !mapElement) {
        resolve(null);
        return;
      }

      this.map = new mapboxgl.Map({
        container: container,
        style: this.style,
        zoom: this.zoom,
        center: [this.lng, this.lat],
        accessToken: environment.mapbox.accessToken,
        attributionControl: false,
      });

      this.map.addControl(this.geolocateControls, 'top-left');
      this.map.addControl(this.navigationControls, 'top-left');

      resolve(this.map);
    });
  }

  // set markers on the map
  setMarkers(map: mapboxgl.Map, locations: Locations[], markers: MapMarker) {
    this.removeMarkers(map, locations, markers);

    locations.forEach(location => {
      const coordinates = JSON.parse(location.coordinates);
    });
  }

  // update existing markers on the map
  updateMarkers(
    map: mapboxgl.Map,
    locations: Locations[],
    markers: MapMarker
  ) {}

  // remove existing markers on the map
  removeMarkers(map: mapboxgl.Map, locations: Locations[], markers: MapMarker) {
    Object.keys(markers).forEach(key => {
      const findMarker = locations.find(
        location => (location as BusLocations).ID === Number(key)
      );
      if (findMarker) return;

      const [marker, lngLat] = markers[key];
      console.log(marker, lngLat);

      marker
        .getElement()
        .removeEventListener('click', this.easeToClick(map, lngLat));
      delete markers[key];
    });
  }

  // Eases to the icon on the map
  easeToClick(map: mapboxgl.Map, lngLat: mapboxgl.LngLatLike) {
    return () =>
      map.easeTo({
        center: lngLat,
        offset: [0, -20],
      });
  }

  // timelapsed map
  fitMapToBounds(markers: mapboxgl.Marker[]): void {
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
      { padding: 20 }
    );
  }

  createPopupContent(transaction: TBusModel): string {
    return `
      <div class="bus-popup">
        <p>IMEI: ${transaction.IMEI}</p>
        <p>Outlet: ${transaction.branchID}</p>
        <p>Pax: ${transaction.pax}</p>
        <p>Total Amt: ${transaction.totalAmount}</p>
        <p>Txn Date: ${transaction.transactDate}</p>
        <p>Route Code: ${transaction.routeCode}</p>
      </div>
    `;
  }
}
