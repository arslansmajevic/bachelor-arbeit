import { Component } from '@angular/core';

@Component({
  selector: 'app-sparql-endpoint',
  templateUrl: './sparql-endpoint.component.html',
  styleUrls: ['./sparql-endpoint.component.css']
})
export class SparqlEndpointComponent {
  sparqlQuery: string = ''; // Query string entered by the user
  result: any; // Stores the query result
  endpointUrl: string = 'http://localhost:7200/repositories/prof-data-repo'; // GraphDB endpoint

  constructor() {}

  async executeQuery() {

  }
}
