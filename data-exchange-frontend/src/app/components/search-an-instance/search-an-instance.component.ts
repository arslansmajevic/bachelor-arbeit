import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {DataService} from "../../services/data.service";
import {catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap} from "rxjs";

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
  private searchSubject = new Subject<string>(); // New subject for search input

  constructor(
    private router: Router,
    private dataService: DataService
  ) {
  }

  ngOnInit() {
    // Subscription to handle autocomplete logic with debounce and distinctUntilChanged
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(query =>
        this.dataService.autocomplete(query, this.selectedLimit).pipe(
          catchError(() => of([])) // Return an empty array in case of error
        )
      )
    ).subscribe(suggestions => {
      this.filteredSuggestions = suggestions;
    });
  }

  onSearchChange() {
    if (this.searchQuery.trim()) {
      this.searchSubject.next(this.searchQuery); // Emit search query
    } else {
      this.filteredSuggestions = [];
    }
  }

  search() {
    this.router.navigate(['graph-vis-js'], {
      state: { firstNode: [{ id: this.searchQuery, label: this.searchQuery.split('/').slice(-2).join('/'), expanded: false }] }
    });
  }
}
