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
import {httpInterceptorProviders} from "./interceptors";
import {MatBadge} from "@angular/material/badge";
import {NgxGraphModule} from "@swimlane/ngx-graph";
import {ExploreGraphComponent} from "./components/explore-graph/explore-graph.component";
import {AngularSplitModule} from "angular-split";
import {ExploreGraphCytoscapeComponent} from "./components/explore-graph-cytoscape/explore-graph-cytoscape.component";
import {GraphVisJsComponent} from "./components/graph-vis-js/graph-vis-js.component";
import {MatExpansionModule, MatExpansionPanelContent} from "@angular/material/expansion";
import {RecShowPanelComponent} from "./components/rec-show-panel/rec-show-panel.component";


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
    UserOverviewComponent,
    ExploreGraphComponent,
    ExploreGraphCytoscapeComponent,
    GraphVisJsComponent,
    RecShowPanelComponent
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
    MatPaginatorModule,
    MatBadge,
    NgxGraphModule,
    AngularSplitModule,
    MatExpansionModule,
    MatExpansionPanelContent,
    MatExpansionModule
  ],
  bootstrap: [AppComponent],
  providers: [
    provideAnimationsAsync(),
    httpInterceptorProviders
  ]
})
export class AppModule { }
