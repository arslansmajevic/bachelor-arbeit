import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/user-login/login/login.component";
import {ResetPasswordComponent} from "./components/user-login/reset-password/reset-password.component";
import {RegisterUserComponent} from "./components/user-login/register-user/register-user.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {
    path: 'user', children: [
      {path: 'login', component: LoginComponent},
      {path: 'reset-password', component: ResetPasswordComponent},
      {path: 'register', component: RegisterUserComponent},
      {path: 'reset-password', component: ResetPasswordComponent}
    ]
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
