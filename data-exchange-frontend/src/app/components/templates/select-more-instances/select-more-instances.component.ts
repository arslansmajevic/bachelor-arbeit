import {Component, ElementRef, ViewChild} from '@angular/core';
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
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;

  searchQuery: string = '';
  filteredSuggestions: string[] = [];
  limits: number[] = [10, 20, 30, 50, 100];
  selectedLimit: number = 10;
  savedNodes: { id: string; label: string; expanded: boolean }[] = [];
  displayedColumns: string[] = ['id'];
  private searchSubject = new Subject<string>();

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((query) =>
          this.dataService.autocomplete(query, this.selectedLimit).pipe(
            catchError(() => of([]))
          )
        )
      )
      .subscribe((suggestions) => {
        this.filteredSuggestions = suggestions;
      });
  }

  onSearchChange() {
    if (this.searchQuery.trim()) {
      this.searchSubject.next(this.searchQuery);
    }
  }

  search() {
    this.router.navigate(['graph-vis-js'], {
      state: { firstNode: this.savedNodes }
    });
  }

  addInstanceAsSaved(flag: boolean, suggestion: string) {
    const newInstance = {
        id: suggestion,
        label: suggestion?.split('/').slice(-2).join('/'),
        expanded: false,
      };

    // Check if the instance already exists in savedNodes
    if (newInstance.id && !this.savedNodes.some(node => node.id === newInstance.id)) {
      this.savedNodes = [...this.savedNodes, newInstance]; // Add to saved nodes if it doesn't exist
    }

    this.searchQuery = ''; // Clear the input field
  }

  onOptionSelected(event: any) {
    const selectedSuggestion = event.option.value;

    // Add the selected suggestion to savedNodes
    this.addInstanceAsSaved(true, selectedSuggestion);

    // Clear the input field programmatically
    this.searchInput.nativeElement.value = '';
  }

  removeNode(node: { id: string; label: string; expanded: boolean }) {
    this.savedNodes = this.savedNodes.filter((savedNode) => savedNode !== node);
  }

}
