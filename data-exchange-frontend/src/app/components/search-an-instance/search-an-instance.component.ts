import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-search-an-instance',
  templateUrl: './search-an-instance.component.html',
  styleUrl: './search-an-instance.component.css'
})
export class SearchAnInstanceComponent {

  searchQuery: string = '';
  suggestions: string[] = ['http://example.org/fhir/Patient/1',
    'http://example.org/fhir/Patient/2',
    'http://example.org/fhir/Patient/3',
    'http://example.org/fhir/Patient/4',
    'http://example.org/fhir/Encounter/Encounter1',
    'http://example.org/fhir/Encounter/Encounter2',
    'http://example.org/fhir/Encounter/Encounter3',
    'http://example.org/fhir/Observation/Obs1',
    'http://example.org/fhir/Observation/Obs2',
    'http://example.org/fhir/Observation/Obs3',
    'http://example.org/fhir/DiagnosticReport/Report1',
  ];
  filteredSuggestions: string[] = [];

  constructor(
    private router: Router
  ) {
  }

  onSearchChange() {
    this.filteredSuggestions = this.suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }



  search() {
    this.router.navigate(['graph-vis-js'], {
      state: { firstNode: { id: this.searchQuery, label: this.searchQuery.split('/').slice(-2).join('/'), expanded: false } }
    });
  }
}
