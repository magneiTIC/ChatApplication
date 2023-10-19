import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './components/test/test.component';
import { LoginComponent } from './views/auth/login/login.component';
import { DashboardComponent } from './views/admin/dashboard/dashboard.component';
import { SettingComponent } from './views/admin/setting/setting.component';
import { AddUserComponent } from './views/admin/add-user/add-user.component';
import { UserSettingComponent } from './views/user/user-setting/user-setting.component';
import { HomeComponent } from './views/user/home/home.component';
import { SidebarComponent } from './components/admin/sidebar/sidebar.component';
import { NotChatComponent } from './views/user/not-chat/not-chat.component';
import { GroupComponent } from './views/user/group/group.component';
import { ContactsComponent } from './views/user/contacts/contacts.component';

const routes: Routes = [




  { path: '', pathMatch: 'full', component: LoginComponent },
  { path: 'test', component: TestComponent },
  { path: 'login', component: LoginComponent },

  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin/setting', component: SettingComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'sidebar', component: SidebarComponent },


  { path: 'user/setting', component: UserSettingComponent },
  { path: 'conversation', component: NotChatComponent },
  { path: 'groups', component: GroupComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'home', component: HomeComponent }


  //{ path: 'home/:idChat', component: HomeComponent },





];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
