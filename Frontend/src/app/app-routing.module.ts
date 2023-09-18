import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TestComponent } from './components/test/test.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './views/auth/login/login.component';
import { SignupComponent } from './views/auth/signup/signup.component';

const routes: Routes = [

  {path:'', pathMatch :'full', component:LandingComponent},
  {path:'home', component:HomeComponent},
  {path:'test', component:TestComponent},
  {path:'login', component:LoginComponent},
  {path:'sign-up', component:SignupComponent},
 


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
