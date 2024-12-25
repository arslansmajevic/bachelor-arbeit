import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-sparql-templates',
  templateUrl: './sparql-templates.component.html',
  styleUrls: ['./sparql-templates.component.css']
})
export class SparqlTemplatesComponent {

  cards = [
    { title: 'Select multiple instances', description: 'Use this template to select multiple instances from the database and show them all at once on a graph.', link: '/templates/multiple-instances' },
    { title: 'SPARQL Endpoint', description: 'Use this template to write custom SPARQL queries. Results are shown in tabular form.', link: '/templates/sparql-endpoint' }
  ];

  // Redirect to a specific link
  navigateToLink(link: string) {
    this.router.navigate([link]);
  }

  constructor(
    private router: Router
  ) {
  }
}
