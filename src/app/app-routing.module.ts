import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Dashboard4Component } from './dashboard4/dashboard4.component';
import { Dashboard5Component } from './dashboard5/dashboard5.component';
import { Dashboard3Component } from './dashboard3/dashboard3.component';
import { Dashboard6Component } from './dashboard6/dashboard6.component';
import { DashboardFatecoins1Component} from './dashboard-fatecoins1/dashboard-fatecoins1.component';
import { DashboardFatecoins2Component} from './dashboard-fatecoins2/dashboard-fatecoins2.component';
import { DashboardFatecoins3Component} from './dashboard-fatecoins3/dashboard-fatecoins3.component';
import { DashboardFatecoins4Component} from './dashboard-fatecoins4/dashboard-fatecoins4.component';

const routes: Routes = [
  {path:'dashboard1', component:Dashboard4Component},
  {path:'dashboard2', component:Dashboard5Component},
  {path:'dashboard3', component:Dashboard3Component},
  {path:'dashboard4', component:Dashboard6Component},
  {path:'dash-fate1', component:DashboardFatecoins1Component},
  {path:'dash-fate2', component:DashboardFatecoins2Component},
  {path:'dash-fate3', component:DashboardFatecoins3Component},
  {path:'dash-fate4', component:DashboardFatecoins4Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [Dashboard3Component, Dashboard4Component, Dashboard5Component, Dashboard6Component, 
  DashboardFatecoins1Component, DashboardFatecoins2Component, DashboardFatecoins3Component, DashboardFatecoins4Component]