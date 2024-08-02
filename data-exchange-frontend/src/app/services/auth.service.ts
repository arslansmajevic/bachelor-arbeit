import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../global/globals";
import {UserLoginDto, UserRegisterDto} from "../dtos/user/user";
import {Observable} from "rxjs";
import {tap} from 'rxjs/operators';
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authBaseUri: string = "";

  constructor(private httpClient: HttpClient, private globals: Globals) {
    this.authBaseUri = this.globals.backendUri + '/authentication';
  }

  /**
   * Login in the user. If it was successful, a valid JWT token will be stored
   *
   * @param userLoginDto User data
   */
  loginUser(userLoginDto: UserLoginDto): Observable<string> {
    return this.httpClient.put(this.authBaseUri, userLoginDto, {responseType: 'text'})
      .pipe(
        tap((authResponse: string) => this.setToken(authResponse))
      );
  }

  registerUser(userRegisterDto: UserRegisterDto): Observable<String> {
    return this.httpClient.post<String>(this.authBaseUri, userRegisterDto)
  }

  /**
   * Check if a valid JWT token is saved in the localStorage
   */
  isLoggedIn() {
    return !!this.getToken() && (this.getTokenExpirationDate(this.getToken()).valueOf() > new Date().valueOf());
  }

  logoutUser() {
    console.log('Logout');
    localStorage.removeItem('authToken');
  }

  getToken() {
    return localStorage.getItem('authToken') || '';
  }

  /**
   * Returns the user role based on the current token
   */
  getUserRole() {
    if (this.getToken() != null) {
      const decoded: any = jwtDecode(this.getToken());
      const authInfo: string[] = decoded.rol;
      if (authInfo.includes('ROLE_ADMIN')) {
        return 'ADMIN';
      } else if (authInfo.includes('ROLE_USER')) {
        return 'USER';
      }
    }
    return 'UNDEFINED';
  }

  private setToken(authResponse: string) {
    localStorage.setItem('authToken', authResponse);
  }

  private getTokenExpirationDate(token: string): Date {

    const decoded: any = jwtDecode(token);
    if (decoded.exp === undefined) {
      return new Date(0);
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  getUserEmail() {
    if (this.getToken() != null) {
      const decoded: any = jwtDecode(this.getToken());
      return decoded.sub;
    }
    return null;
  }
}
