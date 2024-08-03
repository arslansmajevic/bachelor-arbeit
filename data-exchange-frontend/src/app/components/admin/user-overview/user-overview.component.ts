import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrl: './user-overview.component.css'
})
export class UserOverviewComponent implements AfterViewInit{
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'blocked', 'pending'];
  dataSource = new MatTableDataSource<UserInformationDto>(usersData);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}

export interface UserInformationDto {
  firstName: string;
  lastName: string;
  isBlocked: boolean;
  isPending: boolean;
  email: string;
}

const usersData: UserInformationDto[] = [
  {firstName: "Arslan", lastName: "Smajevic", email: "iamarslanb@gmail.com", isBlocked: true, isPending: false},
  {firstName: "Arslan", lastName: "Smajevic", email: "iamarslanb@gmail.com", isBlocked: true, isPending: false},
  {firstName: "Arslan", lastName: "Smajevic", email: "iamarslanb@gmail.com", isBlocked: true, isPending: false},
  {firstName: "Arslan", lastName: "Smajevic", email: "iamarslanb@gmail.com", isBlocked: true, isPending: false},
  {firstName: "Arslan", lastName: "Smajevic", email: "iamarslanb@gmail.com", isBlocked: true, isPending: false},
  {firstName: "Arslan", lastName: "Smajevic", email: "iamarslanb@gmail.com", isBlocked: true, isPending: false},
  {firstName: "Arslan", lastName: "Smajevic", email: "iamarslanb@gmail.com", isBlocked: true, isPending: false},
  {firstName: "Arslan", lastName: "Smajevic", email: "iamarslanb@gmail.com", isBlocked: true, isPending: false},
  {firstName: "Arslan", lastName: "Smajevic", email: "iamarslanb@gmail.com", isBlocked: true, isPending: false},
  {firstName: "Arslan", lastName: "Smajevic", email: "iamarslanb@gmail.com", isBlocked: true, isPending: false},
  {firstName: "Arslan", lastName: "Smajevic", email: "iamarslanb@gmail.com", isBlocked: true, isPending: false},
  {firstName: "Arslan", lastName: "Smajevic", email: "iamarslanb@gmail.com", isBlocked: true, isPending: false}
];
