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

const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: 'user', canActivate: ([AnonymousUserGuard]), children: [
      {path: '', redirectTo: '/', pathMatch: 'full'},
      {path: 'login', component: LoginComponent},
      {path: 'reset-password', component: ResetPasswordComponent},
      {path: 'register', component: RegisterUserComponent},
      {path: 'reset-password', component: ResetPasswordComponent}
    ]
  },
  { path: 'graph', component: ExploreGraphComponent},
  {
    path: 'admin', canActivate: mapToCanActivate([AdminAuthGuard]), children: [
      {path: '', redirectTo: '/', pathMatch: 'full'},
      {path: 'dashboard', component: AdminDashboardComponent},
      {path: 'database-config', component: DatabaseConfigComponent}
    ]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
