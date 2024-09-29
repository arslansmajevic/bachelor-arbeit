import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../global/globals";
import {Observable} from "rxjs";
import {Link} from "../dtos/nodes/node";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUri: string = "";

  constructor(
    private http : HttpClient,
    private globals: Globals
  ) {
    this.baseUri = this.globals.backendUri + '/data';
  }

  expandNode(nodeUri: string): Observable<Link[]> {
    return this.http.put<Link[]>(this.baseUri + '/expand-node', {nodeUri: nodeUri});
  }
}
