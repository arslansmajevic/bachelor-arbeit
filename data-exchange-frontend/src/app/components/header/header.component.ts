import { Component } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(
    public authService: AuthService,
    private router: Router,
    private notification: ToastrService
  ) { }

  ngOnInit() {
  }

  logoutUser(): void {
    this.authService.logoutUser();
    this.notification.success("You have been successfully logged out!");
    this.router.navigate(['']);
  }
}
