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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterUserComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterOutlet,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
