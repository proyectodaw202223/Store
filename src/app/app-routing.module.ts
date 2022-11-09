import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { ClientRoutingModule } from './client/client-routing.module';
import { ClientComponent } from './client/client.component';


const routes: Routes = [
  { path: '', component: ClientComponent },
  { path: 'admin', component: AdminComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    ClientRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
