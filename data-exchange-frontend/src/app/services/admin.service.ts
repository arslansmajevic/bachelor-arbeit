import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {UserInformationDto, UserSearchDto} from "../dtos/user/user";
import {Observable} from "rxjs";
import {PaginatedResponse} from "../dtos/user/paginator";
import {Globals} from "../global/globals";

class UserListDto {
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUri: string = "";

  constructor(
    private http : HttpClient,
    private globals: Globals
  ) {
    this.baseUri = this.globals.backendUri + '/admin';
  }

  search(searchParams: UserSearchDto): Observable<PaginatedResponse<UserInformationDto>> {
    let params = new HttpParams();

    if (searchParams.firstName) {
      params = params.append("firstName", searchParams.firstName);
    }

    if (searchParams.lastName) {
      params = params.append("lastName", searchParams.lastName);
    }

    if (searchParams.email) {
      params = params.append("email", searchParams.email);
    }

    if (searchParams.isLocked === true || searchParams.isLocked === false) {
      params = params.append("isLocked", searchParams.isLocked);
    }

    if (searchParams.isAdmin === true || searchParams.isAdmin === false) {
      params = params.append("isAdmin", searchParams.isAdmin);
    }

    if (searchParams.isPending === true || searchParams.isPending == false) {
      params = params.append("isPending", searchParams.isPending);
    }

    params = params.append('pageIndex', searchParams.pageIndex.toString());
    params = params.append('pageSize', searchParams.pageSize.toString());

    return this.http.get<PaginatedResponse<UserInformationDto>>(this.baseUri + '/search', { params });
  }

  retrieveAllPendingUsers(): Observable<PaginatedResponse<UserInformationDto>> {

    let params = new HttpParams();
    params = params.append('pageIndex', "0");
    params = params.append('pageSize', '100');
    params = params.append('isPending', true);

    return this.http.get<PaginatedResponse<UserInformationDto>>(this.baseUri + '/search', { params });
  }

  grantUserPermission(email: String): Observable<UserInformationDto> {
    return this.http.put<UserInformationDto>(this.baseUri + '/grant-permission/' + email, {})
  }
}
