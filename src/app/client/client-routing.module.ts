import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { ClientHomeComponent } from './pages/client-home/client-home.component';
import { ClientComponent } from './client.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProductsComponent } from './pages/products/products.component';


const routes: Routes = [
  {
    path: '', 
    component: ClientComponent,
    children:[
      { path: '', component: ClientHomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent},
      { path: 'products', component: ProductsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
