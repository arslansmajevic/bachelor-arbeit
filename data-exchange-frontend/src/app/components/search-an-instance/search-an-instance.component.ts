import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {DataService} from "../../services/data.service";
import {catchError, debounceTime, distinctUntilChanged, of, switchMap} from "rxjs";

@Component({
  selector: 'app-search-an-instance',
  templateUrl: './search-an-instance.component.html',
  styleUrl: './search-an-instance.component.css'
})
export class SearchAnInstanceComponent {

  searchQuery: string = '';
  filteredSuggestions: string[] = [];
  limits: number[] = [10, 20, 30, 50, 100]; // Define available limits
  selectedLimit: number = 10; // Default limit

  constructor(
    private router: Router,
    private dataService: DataService
  ) {
  }

  onSearchChange() {
    if (this.searchQuery.trim()) {
      this.dataService.autocomplete(this.searchQuery, this.selectedLimit)
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(() => {
            return this.dataService.autocomplete(this.searchQuery, this.selectedLimit);
          }),
          catchError(error => {
            return of([]); // Return an empty array in case of error
          })
        )
        .subscribe(suggestions => {
          this.filteredSuggestions = suggestions;
        });
    } else {
      this.filteredSuggestions = [];
    }
  }

  search() {
    this.router.navigate(['graph-vis-js'], {
      state: { firstNode: { id: this.searchQuery, label: this.searchQuery.split('/').slice(-2).join('/'), expanded: false } }
    });
  }
}
