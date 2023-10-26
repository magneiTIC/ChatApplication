import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ListAgentComponent } from './views/list-agent/list-agent.component';
import { ListDirectorComponent } from './views/list-director/list-director.component';
import { AddDirectorComponent } from './views/add-director/add-director.component';
import { AddAgentComponent } from './views/add-agent/add-agent.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  
  { path: 'listeDirecteur', component: ListDirectorComponent },
  { path: 'AjoutDirecteur', component: AddDirectorComponent },

  { path: 'listeAgent', component: ListAgentComponent },
  { path: 'AjoutAgent', component: AddAgentComponent },




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
