import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './components/test/test.component';
import { LoginComponent } from './views/auth/login/login.component';
import { SettingComponent } from './views/admin/setting/setting.component';
import { UserSettingComponent } from './views/user/user-setting/user-setting.component';
import { HomeComponent } from './views/user/home/home.component';
import { SidebarComponent } from './components/admin/sidebar/sidebar.component';
import { GroupComponent } from './views/user/group/group.component';
import { ContactsComponent } from './views/user/contacts/contacts.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { AddAgentComponent } from './views/admin/add-agent/add-agent.component';
import { ErrorComponent } from './views/error/error.component';
import { AuthGuard } from './Guard/auth.guard';

const routes: Routes = [

  { path: '', pathMatch: 'full', component: LoginComponent },
  { path: 'test', component: TestComponent },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'admin/setting', component: SettingComponent, canActivate: [AuthGuard], data: { expectedRole: 'ADMIN' } },
  { path: 'add-agent', component: AddAgentComponent },
  { path: 'sidebar', component: SidebarComponent },

  { path: 'user/setting', component: UserSettingComponent },
  { path: 'groups', component: GroupComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { expectedProfile: 'AGENT', expectedProfile0: 'DIRECTEUR' } },

  { path: 'error', component: ErrorComponent },

  //{ path: 'home/:idChat', component: HomeComponent },





];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
