import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import {AppComponent} from "./app.component";
import {FooterComponent} from "./components/footer/footer.component";
import {HeaderComponent} from "./components/header/header.component";
import {RouterOutlet} from "@angular/router";
import {BrowserModule} from "@angular/platform-browser";
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {LoginComponent} from "./components/user-login/login/login.component";
import {RegisterUserComponent} from "./components/user-login/register-user/register-user.component";
import {HomeComponent} from "./components/home/home.component";
import {FormsModule} from "@angular/forms";
import {ResetPasswordComponent} from "./components/user-login/reset-password/reset-password.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPopperjsModule} from "ngx-popperjs";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {AdminDashboardComponent} from "./components/admin/admin-dashboard/admin-dashboard.component";
import {UserOverviewComponent} from "./components/admin/user-overview/user-overview.component";
import {MatTable, MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterUserComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ResetPasswordComponent,
    AdminDashboardComponent,
    UserOverviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterOutlet,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    NgxPopperjsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatTable,
    MatTableModule,
    MatPaginatorModule
  ],
  bootstrap: [AppComponent],
  providers: [
    provideAnimationsAsync()
  ]
})
export class AppModule { }
