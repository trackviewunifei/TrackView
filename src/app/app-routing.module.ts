import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashSinglePageGeneralComponent } from './dash-single-page-general/dash-single-page-general.component';
import { DashSinglePageComparativeComponent } from './dash-single-page-comparative/dash-single-page-comparative.component';
import { DashSinglePageFocalPointComponent } from './dash-single-page-focal-point/dash-single-page-focal-point.component';
import { DashSinglePageDetailsComponent } from './dash-single-page-details/dash-single-page-details.component';
import { DashGeneralComponent} from './dash-general/dash-general.component';
import { DashComparativeComponent} from './dash-comparative/dash-comparative.component';
import { DashFocalPointComponent} from './dash-focal-point/dash-focal-point.component';
import { DashDetailsComponent} from './dash-details/dash-details.component';

const routes: Routes = [
  {path:'dashboard1', component:DashSinglePageGeneralComponent},
  {path:'dashboard2', component:DashSinglePageComparativeComponent},
  {path:'dashboard3', component:DashSinglePageFocalPointComponent},
  {path:'dashboard4', component:DashSinglePageDetailsComponent},
  {path:'dashboard5', component:DashGeneralComponent},
  {path:'dashboard6', component:DashComparativeComponent},
  {path:'dashboard7', component:DashFocalPointComponent},
  {path:'dashboard8', component:DashDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [DashSinglePageGeneralComponent, DashSinglePageComparativeComponent, DashSinglePageFocalPointComponent, DashSinglePageDetailsComponent, 
  DashGeneralComponent, DashComparativeComponent, DashFocalPointComponent, DashDetailsComponent]