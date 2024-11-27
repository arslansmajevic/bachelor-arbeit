import { Component } from '@angular/core';
import {catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap} from "rxjs";
import {Router} from "@angular/router";
import {DataService} from "../../../services/data.service";
import {book} from "ngx-bootstrap-icons";

@Component({
  selector: 'app-select-more-instances',
  templateUrl: './select-more-instances.component.html',
  styleUrl: './select-more-instances.component.css'
})
export class SelectMoreInstancesComponent {
  searchQuery: string = '';
  filteredSuggestions: string[] = [];
  limits: number[] = [10, 20, 30, 50, 100]; // Define available limits
  selectedLimit: number = 10; // Default limit
  savedNodes: { id: string; label: string; expanded: boolean }[] = [];
  displayedColumns: string[] = ['id'];
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
    }
  }

  search() {


    this.router.navigate(['graph-vis-js'], {
      state: { firstNode: this.savedNodes }
    });
  }

  function() {
    console.log(this.savedNodes)

    console.log("hello")
  }

  addInstanceAsSaved(flag: boolean, suggestion?: string) {

    if (!flag) {
      if (this.searchQuery.trim()) {
        const newInstance = {
          id: this.searchQuery,
          label: this.searchQuery.split('/').slice(-2).join('/'),
          expanded: false
        };

        this.savedNodes = [...this.savedNodes, newInstance]; // Reassign to trigger change detection
        this.searchQuery = ""; // Clear the search query
      }
    } else {
      if (suggestion) {
        const newInstance = {
          id: suggestion,
          label: suggestion.split('/').slice(-2).join('/'),
          expanded: false
        };

        this.savedNodes = [...this.savedNodes, newInstance]; // Reassign to trigger change detection
        this.searchQuery = ""; // Clear the search query
      }
    }
    this.searchQuery = ""; // Clear the search query
  }
}
