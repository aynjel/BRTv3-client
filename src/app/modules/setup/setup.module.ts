import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { SetupComponent } from 'src/app/pages/setup/setup.component';
import { EditIMEIComponent } from 'src/app/shared/modals/edit-imei/edit-imei.component';
import { AddIMEIComponent } from 'src/app/shared/modals/add-imei/add-imei.component';
import { RemoveIMEIComponent } from 'src/app/shared/modals/remove-imei/remove-imei.component';
import { AddPersonnelComponent } from 'src/app/shared/modals/add-personnel/add-personnel.component';
import { EditPersonnelComponent } from 'src/app/shared/modals/edit-personnel/edit-personnel.component';
import { RemovePersonnelComponent } from 'src/app/shared/modals/remove-personnel/remove-personnel.component';
import { AddRouteComponent } from 'src/app/shared/modals/add-route/add-route.component';
import { EditRouteComponent } from 'src/app/shared/modals/edit-route/edit-route.component';
import { RemoveRouteComponent } from 'src/app/shared/modals/remove-route/remove-route.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddMerhantComponent } from 'src/app/shared/modals/add-merhant/add-merhant.component';
import { EditMerhantComponent } from 'src/app/shared/modals/edit-merhant/edit-merhant.component';

const routes: Routes = [{ path: '', component: SetupComponent }];

@NgModule({
  declarations: [
    SetupComponent,
    EditIMEIComponent,
    AddIMEIComponent,
    RemoveIMEIComponent,
    AddPersonnelComponent,
    EditPersonnelComponent,
    RemovePersonnelComponent,
    AddRouteComponent,
    EditRouteComponent,
    RemoveRouteComponent,
    AddMerhantComponent,
    EditMerhantComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [RouterModule],
})
export class SetupModule {}
