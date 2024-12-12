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
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
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
import {SearchAnInstanceComponent} from "./components/search-an-instance/search-an-instance.component";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSelect, MatSelectModule} from "@angular/material/select";
import {SparqlTemplatesComponent} from "./components/sparql-templates/sparql-templates.component";
import {
  SelectMoreInstancesComponent
} from "./components/templates/select-more-instances/select-more-instances.component";
import {MatDrawer, MatDrawerContainer, MatSidenav, MatSidenavModule} from "@angular/material/sidenav";
import {SparqlEndpointComponent} from "./components/templates/sparql-endpoint/sparql-endpoint.component";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {CustomStatisticsComponent} from "./components/statistics/custom-statistics/custom-statistics.component";
import {CodemirrorModule} from "@ctrl/ngx-codemirror";
import {MatSortModule} from "@angular/material/sort";
import {GoogleChartsModule} from "angular-google-charts";
import {DatabaseConfigComponent} from "./components/admin/database-config/database-config.component";
import {NgxChartsModule} from "@swimlane/ngx-charts";

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
    RecShowPanelComponent,
    SearchAnInstanceComponent,
    SparqlTemplatesComponent,
    SelectMoreInstancesComponent,
    SparqlEndpointComponent,
    CustomStatisticsComponent,
    DatabaseConfigComponent
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
    MatExpansionModule,
    MatButtonModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatFormField,
    MatInput,
    MatSelect,
    MatDrawerContainer,
    MatDrawer,
    MatSidenavModule,
    MatExpansionModule,
    MatCard,
    MatCardTitle,
    MatCardContent,
    CodemirrorModule,
    MatSortModule,
    GoogleChartsModule,
    ReactiveFormsModule,
    MatLabel,
    MatFormFieldModule,
    MatSelectModule,
    NgxChartsModule
  ],
  bootstrap: [AppComponent],
  providers: [
    provideAnimationsAsync(),
    httpInterceptorProviders
  ]
})
export class AppModule { }
