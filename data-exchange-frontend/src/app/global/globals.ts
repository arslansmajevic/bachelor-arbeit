import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Globals {
  readonly backendUri: string = this.findBackendUrl();

  private findBackendUrl(): string {
    if (window.location.port === '4200') { // local `ng serve`, backend at localhost:8080
      return 'http://localhost:8080/api/v1';
    } else {
      // assume deployed somewhere and backend is available at same host/port as frontend
      // TODO: this needs some clearing up
      // return 'http://backend-spring-boot-1:8080/api/v1';
      console.log(window.location.port);
      return 'http://almach.dbai.tuwien.ac.at:8080/api/v1';
      // return window.location.protocol + '//' + window.location.host + window.location.pathname + 'api/v1';
    }
  }
}


