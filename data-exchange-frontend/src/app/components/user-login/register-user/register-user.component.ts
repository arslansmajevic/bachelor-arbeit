import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {UserLoginDto, UserRegisterDto} from "../../../dtos/user/user";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent {

  user: UserRegisterDto = {
    email: "",
    firstName: "",
    lastName: "",
    password: ""
  }
  firstPassword: string = "";
  secondPassword: string = "";

  constructor(
    private notification: ToastrService,
    private authService: AuthService,
    private router: Router
  ) { }

  registerUser(): void {
    this.askForPermission(this.user);
  }

  checkEmailValidity(email: string): boolean {
    if (email === '') {
      return true;
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  checkPasswords(): boolean {
    if (this.secondPassword == '') {
      return true;
    }

    if (this.firstPassword != this.secondPassword) {
      return false;
    } else {
      return true;
    }
  }

  askForPermission(userRegisterDto: UserRegisterDto): void {
    this.notification.info('The admin will be notified about your ask for permission.')
    this.router.navigate(['']);
    /*this.authService.loginUser(userLoginDto).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: error => {

        console.log(error)
        const errorObj = JSON.parse(error.error);
        const formattedError = `${errorObj.detail}`;

        this.notification.error(formattedError, "Could not log in due to:", {enableHtml: true});
      }
    });*/
  }
}
