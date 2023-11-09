import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ListAgentComponent } from './views/list-agent/list-agent.component';
import { ListDirectorComponent } from './views/list-director/list-director.component';
import { AddDirectorComponent } from './views/add-director/add-director.component';
import { AddAgentComponent } from './views/add-agent/add-agent.component';
import { InfoUserComponent } from './views/info-user/info-user.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AuthGuard } from './Guard/auth.guard';

const routes: Routes = [

  { path: '', pathMatch: 'full', component: DashboardComponent, canActivate: [AuthGuard], data: { expectedProfile: 'ADMIN' } },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { expectedProfile: 'ADMIN' } },
  { path: 'info/:uid', component: InfoUserComponent, canActivate: [AuthGuard], data: { expectedProfile: 'ADMIN' } },

  {path: 'add-agent', component: AddAgentComponent, canActivate: [AuthGuard], data: { expectedProfile: 'ADMIN' }},

  
  { path: 'listeDirecteur', component: ListDirectorComponent, canActivate: [AuthGuard], data: { expectedProfile: 'ADMIN' } },
  { path: 'AjoutDirecteur', component: AddDirectorComponent,canActivate: [AuthGuard], data: { expectedProfile: 'ADMIN' } },


  { path: 'listeAgent', component: ListAgentComponent, canActivate: [AuthGuard], data: { expectedProfile: 'ADMIN' } },
  { path: 'AjoutAgent', component: AddAgentComponent, canActivate: [AuthGuard], data: { expectedProfile: 'ADMIN' } },

  { path: 'side', component: SidebarComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
