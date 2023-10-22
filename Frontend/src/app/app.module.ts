import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TestComponent } from './components/test/test.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatToolbarModule} from '@angular/material/toolbar'
import{MatListModule} from '@angular/material/list'
import{ } from '@angular/material/'
import{ MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component'
import { environment } from 'src/environments/environment';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { HttpClientModule } from '@angular/common/http';
import { SettingComponent } from './views/admin/setting/setting.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { AddUserComponent } from './views/admin/add-user/add-user.component';
import { ChatComponent } from './components/user/chat/chat.component';
import { ContactComponent } from './components/user/contact/contact.component';
import { SideComponent } from './components/user/side/side.component';
import { SuperAdminComponent } from './views/super-admin/super-admin.component';
import { UserSettingComponent } from './views/user/user-setting/user-setting.component';
import { HomeComponent } from './views/user/home/home.component';
import { SidebarComponent } from './components/admin/sidebar/sidebar.component';
import { DiscussionComponent } from './components/user/discussion/discussion.component';
import { NotChatComponent } from './views/user/not-chat/not-chat.component';
import { GroupComponent } from './views/user/group/group.component';
import { ContactsComponent } from './views/user/contacts/contacts.component';
import { Test1Component } from './views/admin/test1/test1.component';



const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TestComponent,
    LoginComponent,
    RegisterComponent,
    SettingComponent,
    AddUserComponent,
    ChatComponent,
    ContactComponent,
    SideComponent,
    SidebarComponent,
    SuperAdminComponent,
    UserSettingComponent,
    DiscussionComponent,
    NotChatComponent,
    GroupComponent,
    ContactsComponent,
    Test1Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),    
    SocketIoModule.forRoot(config),

  ],
  exports:[
    MatFormFieldModule,
    MatAutocompleteModule,
    


  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
export class MaterialModule { }
