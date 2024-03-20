import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent {
  @Input() statusMessage: string = '';

  isLoading: boolean = true;
  isError: boolean = false;
}
