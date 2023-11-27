import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './components/test/test.component';
import { LoginComponent } from './views/auth/login/login.component';
import { UserSettingComponent } from './views/user/user-setting/user-setting.component';
import { HomeComponent } from './views/user/home/home.component';
import { GroupComponent } from './views/user/group/group.component';
import { ContactsComponent } from './views/user/contacts/contacts.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { AddAgentComponent } from './views/admin/add-agent/add-agent.component';
import { ErrorComponent } from './views/error/error.component';
import { AuthGuard } from './Guard/auth.guard';
import { AuthorisationComponent } from './views/admin/authorisation/authorisation.component';

const routes: Routes = [

  { path: '', pathMatch: 'full', component: LoginComponent },
  // { path: 'test', component: TestComponent },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent,  },

  { path: 'add-agent', component: AddAgentComponent , canActivate: [AuthGuard], data: { expectedProfile: 'DIRECTEUR' }},
  { path: 'autorisation', component: AuthorisationComponent, canActivate: [AuthGuard], data: { expectedProfile: 'DIRECTEUR' }},


  // , canActivate: [AuthGuard], data: { expectedProfile: 'DIRECTEUR' }

  { path: 'user/setting', component: UserSettingComponent ,  },
  { path: 'groups', component: GroupComponent ,  },
  { path: 'contacts', component: ContactsComponent ,   },
  { path: 'home', component: HomeComponent ,    },

  { path: 'error', component: ErrorComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
