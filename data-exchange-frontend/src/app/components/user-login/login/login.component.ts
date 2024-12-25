import {Component} from '@angular/core';
import {UserLoginDto} from "../../../dtos/user/user";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  user: UserLoginDto = {
    email: "",
    password: ""
  };

  constructor(
    private notification: ToastrService,
    private authService: AuthService,
    private router: Router
  ) { }

  loginUser(): void {
    this.authenticateUser(this.user);
  }

  checkEmailValidity(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  authenticateUser(userLoginDto: UserLoginDto): void {
    this.authService.loginUser(userLoginDto).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: error => {

        this.notification.error(error.error)
      }
    });
  }

}
