import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {UserInformationDto, UserSearchDto} from "../../../dtos/user/user";
import {debounceTime, Subject} from "rxjs";
import {AdminService} from "../../../services/admin.service";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrl: './user-overview.component.css'
})
export class UserOverviewComponent implements AfterViewInit{
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'admin', 'blocked', 'pending', 'actions'];
  dataSource = new MatTableDataSource<UserInformationDto>();
  searchParams: UserSearchDto = {pageIndex: 0, pageSize: 10};
  searchChangedObservable = new Subject<void>();
  isLocked: String = "";
  isAdmin: String = "";
  isPending: String = "";
  total: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
    private notification: ToastrService,
    private authService: AuthService
  ) {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.searchChangedObservable
      .pipe(debounceTime(300))
      .subscribe({next: () => this.reloadUsers()});
    this.reloadUsers();
  }

  searchChanged(): void {
    this.searchChangedObservable.next();
  }

  reloadUsers(): void {

    if (this.isLocked === "true") {
      this.searchParams.isLocked = true;
    } else {
      if (this.isLocked === "false") {
        this.searchParams.isLocked = false;
      } else {
        delete this.searchParams.isLocked;
      }
    }

    if (this.isAdmin === "true") {
      this.searchParams.isAdmin = true;
    } else {
      if (this.isAdmin === "false") {
        this.searchParams.isAdmin = false;
      } else {
        delete this.searchParams.isAdmin;
      }
    }

    if (this.isPending === "true") {
      this.searchParams.isPending = true;
    } else {
      if (this.isPending === "false") {
        this.searchParams.isPending = false;
      } else {
        delete this.searchParams.isPending;
      }
    }

    this.adminService.search(this.searchParams)
      .subscribe({
        next: data => {
          console.log(data)
          this.dataSource.data = data.content;
          this.total = data.totalElements;
          this.cdr.detectChanges();
        },
        error: err => {
          this.notification.error(err.error)
        }
      })
  }

  grantPermissionToUser(email: String): void {
    console.log(email)

    this.adminService.grantUserPermission(email);
  }

  unblockUser(email: String): void {

  }

  blockUser(email: String): void {

  }

  resetPassword(email: String): void {

  }

  thisAdmin(email: String) {
    return this.authService.getUserEmail() !== email;
  }
}
