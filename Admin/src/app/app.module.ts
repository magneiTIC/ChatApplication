import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { FixedComponent } from './components/fixed/fixed.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './components/footer/footer.component';
import { ListDirectorComponent } from './views/list-director/list-director.component';
import { ListAgentComponent } from './views/list-agent/list-agent.component';
import { AddDirectorComponent } from './views/add-director/add-director.component';
import { AddAgentComponent } from './views/add-agent/add-agent.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { InfoUserComponent } from './views/info-user/info-user.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    FixedComponent,
    SidebarComponent,
    FooterComponent,
    ListDirectorComponent,
    ListAgentComponent,
    AddDirectorComponent,
    AddAgentComponent,
    InfoUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
