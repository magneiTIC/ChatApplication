import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ListAgentComponent } from './views/list-agent/list-agent.component';
import { ListDirectorComponent } from './views/list-director/list-director.component';
import { AddDirectorComponent } from './views/add-director/add-director.component';
import { AddAgentComponent } from './views/add-agent/add-agent.component';
import { InfoUserComponent } from './views/info-user/info-user.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

const routes: Routes = [

  { path: '', pathMatch: 'full', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'info/:uid', component: InfoUserComponent },

  
  { path: 'listeDirecteur', component: ListDirectorComponent },
  { path: 'AjoutDirecteur', component: AddDirectorComponent },


  { path: 'listeAgent', component: ListAgentComponent },
  { path: 'AjoutAgent', component: AddAgentComponent },

  { path: 'side', component: SidebarComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
