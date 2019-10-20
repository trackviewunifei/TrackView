import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Dashboard4Component } from './dashboard4/dashboard4.component';
import { Dashboard5Component } from './dashboard5/dashboard5.component';
import { Dashboard3Component } from './dashboard3/dashboard3.component';
import { Dashboard6Component } from './dashboard6/dashboard6.component';

const routes: Routes = [
  {path:'dashboard1', component:Dashboard4Component},
  {path:'dashboard2', component:Dashboard5Component},
  {path:'dashboard3', component:Dashboard3Component},
  {path:'dashboard4', component:Dashboard6Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [Dashboard3Component, Dashboard4Component, Dashboard5Component, Dashboard6Component]