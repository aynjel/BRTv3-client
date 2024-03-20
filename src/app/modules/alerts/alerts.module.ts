import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AlertsComponent } from 'src/app/pages/alerts/alerts.component';
import { SharedModule } from '../shared/shared.module';
import { AlertDetailsComponent } from 'src/app/shared/modals/alert-details/alert-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [{ path: '', component: AlertsComponent }];

@NgModule({
  declarations: [AlertsComponent, AlertDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [RouterModule],
})
export class AlertsModule {}
