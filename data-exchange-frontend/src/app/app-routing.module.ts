import { NgModule } from '@angular/core';
import {mapToCanActivate, RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/user-login/login/login.component";
import {ResetPasswordComponent} from "./components/user-login/reset-password/reset-password.component";
import {RegisterUserComponent} from "./components/user-login/register-user/register-user.component";
import {AdminDashboardComponent} from "./components/admin/admin-dashboard/admin-dashboard.component";
import {AdminAuthGuard} from "./guards/admin-auth.guard";
import {AnonymousUserGuard} from "./guards/anonymous-user.guard";
import {DatabaseConfigComponent} from "./components/admin/database-config/database-config.component";
import {ExploreGraphComponent} from "./components/explore-graph/explore-graph.component";
import {ExploreGraphCytoscapeComponent} from "./components/explore-graph-cytoscape/explore-graph-cytoscape.component";
import {GraphVisJsComponent} from "./components/graph-vis-js/graph-vis-js.component";
import {SearchAnInstanceComponent} from "./components/search-an-instance/search-an-instance.component";
import {SparqlTemplatesComponent} from "./components/sparql-templates/sparql-templates.component";
import {SparqlEndpointComponent} from "./components/templates/sparql-endpoint/sparql-endpoint.component";
import {CustomStatisticsComponent} from "./components/statistics/custom-statistics/custom-statistics.component";
import {
  SelectMoreInstancesComponent
} from "./components/templates/select-more-instances/select-more-instances.component";
import {StandardUserGuard} from "./guards/standard-user.guard";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: 'user', canActivate: ([AnonymousUserGuard]), children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'register', component: RegisterUserComponent }
    ]
  },
  { path: 'search-instance', canActivate: ([StandardUserGuard]), component: SearchAnInstanceComponent },
  { path: 'graph-vis-js', canActivate: ([StandardUserGuard]), component: GraphVisJsComponent },
  {
    path: 'admin', canActivate: mapToCanActivate([AdminAuthGuard]), children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'database-config', component: DatabaseConfigComponent }
    ]
  },
  { path: 'templates', canActivate: ([StandardUserGuard]), component: SparqlTemplatesComponent },
  {
    path: 'templates', canActivate: ([StandardUserGuard]), children: [
      {path: '', redirectTo: 'templates', pathMatch: 'full'}, // Redirect to the default child
      {path: 'sparql-endpoint', component: SparqlEndpointComponent},
      {path: 'multiple-instances', component: SelectMoreInstancesComponent}
    ]
  },
  { path: 'statistics', canActivate: ([StandardUserGuard]), component: CustomStatisticsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
