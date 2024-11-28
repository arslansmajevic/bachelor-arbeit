import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../global/globals";
import {Observable} from "rxjs";
import {Link} from "../dtos/nodes/node";
import {SparqlResult} from "../dtos/sparql/sparql";

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

  expandNeighbouringNodes(nodeUri: string): Observable<Link[]> {
    return this.http.put<Link[]>(this.baseUri + '/expand-neighbour', {nodeUri: nodeUri});
  }

  expandNode(nodeUri: string): Observable<Link[]> {
    return this.http.put<Link[]>(this.baseUri + '/expand-node', {nodeUri: nodeUri});
  }

  autocomplete(keyword: string, limit: number): Observable<string[]> {
    const params = { keyword, limit };
    return this.http.get<string[]>(`${this.baseUri}/autocomplete`, { params });
  }

  performCustomQuery(query: string): Observable<SparqlResult> {
    return this.http.put<SparqlResult>(this.baseUri + '/perform-query', {query: query})
  }
}
