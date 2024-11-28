import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthService} from "../services/auth.service";
import {Globals} from "../global/globals";
import {Router} from "@angular/router";
import {catchError, Observable, throwError} from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private globals: Globals,
    private router: Router
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authUri = this.globals.backendUri + '/authentication';
    const registerUserUri = this.globals.backendUri + '/users/create'
    const resetPasswordUri = this.globals.backendUri + '/users/reset/password/user'
    const sparqlEndpoint = 'http://localhost:7200/repositories/prof-data-repo';

    console.log('aarslaan')
    console.log(req.url)

    if (req.url === authUri || req.url === registerUserUri || req.url === resetPasswordUri || req.url.startsWith('http://localhost:7200')) {
      return next.handle(req);
    }

    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + this.authService.getToken())
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.authService.logoutUser();
          this.router.navigate(['/']);
        }
        return throwError(error);
      })
    );
  }
}
