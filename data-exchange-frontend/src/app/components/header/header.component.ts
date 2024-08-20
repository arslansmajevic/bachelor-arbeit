import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {AdminService} from "../../services/admin.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  constructor(
    public authService: AuthService,
    private router: Router,
    private notification: ToastrService,
    private adminService: AdminService
  ) { }

  numberOfPendingRequests: number = 0;

  ngOnInit() {

    if (this.authService.isLoggedIn() && this.authService.getUserRole() === "ADMIN") {
      this.adminService.retrieveAllPendingUsers()
        .subscribe({
          next: data => {
            this.numberOfPendingRequests = data.content.length;
          },
          error: err => {

          }
        })
    }
  }

  logoutUser(): void {
    this.authService.logoutUser();
    this.notification.success("You have been successfully logged out!");
    this.router.navigate(['']);
  }


}
