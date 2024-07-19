import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import {AppComponent} from "./app.component";
import {FooterComponent} from "./components/footer/footer.component";
import {HeaderComponent} from "./components/header/header.component";
import {RouterOutlet} from "@angular/router";
import {BrowserModule} from "@angular/platform-browser";



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FooterComponent,
    HeaderComponent,
    RouterOutlet
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
