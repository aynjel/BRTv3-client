import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from 'src/app/pages/map/map.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [{ path: '', component: MapComponent }];

@NgModule({
  declarations: [
    MapComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [RouterModule]
})
export class MapModule { }
