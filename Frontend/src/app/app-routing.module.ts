import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TestComponent } from './components/test/test.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './views/auth/login/login.component';
import { DashboardComponent } from './views/admin/dashboard/dashboard.component';

const routes: Routes = [

  {path:'', pathMatch :'full',component:LoginComponent },
  {path:'home', component:HomeComponent},
  {path:'test', component:TestComponent},
  {path:'login', component:LoginComponent},
  {path:'dashboard', component:DashboardComponent},

 


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
