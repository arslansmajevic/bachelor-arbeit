import {Component, ViewChild} from '@angular/core';
import {DataService} from "../../../services/data.service";
import {SparqlQuery, SparqlResult} from "../../../dtos/sparql/sparql";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-sparql-endpoint',
  templateUrl: './sparql-endpoint.component.html',
  styleUrls: ['./sparql-endpoint.component.css']
})
export class SparqlEndpointComponent {
  sparqlQuery: string = ''; // Query string entered by the user
  result: SparqlResult | null = null; // Stores the query result
  displayedColumns: string[] = []; // Table column headers
  dataSource = new MatTableDataSource<any>(); // Data source for MatTable

  sparqlQueries: SparqlQuery[] = [];
  selectedQuery: SparqlQuery = {
    id: 0,
    name: '',
    description: '',
    query: ''
  }; // Allow null initially
  @ViewChild(MatPaginator) paginator!: MatPaginator; // Reference to the paginator
  @ViewChild(MatSort) sort!: MatSort; // Reference to sort

  constructor(
    private dataService: DataService
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadQueries();
  }

  executeQuery() {
    if (!this.sparqlQuery.trim()) {
      alert('Please enter a SPARQL query.');
      return;
    }

    console.log('query')

    this.dataService.performCustomQuery(this.sparqlQuery)
      .subscribe({
        next: (data: SparqlResult) => {
          this.result = data;
          this.processSparqlResponse(data);
        },
        error: err => {
          console.error(err);
          alert('An error occurred while executing the query.');
        }
      });
  }

  private processSparqlResponse(data: SparqlResult) {
    if (data && data.head?.vars && data.results?.bindings) {
      // Set columns dynamically based on "vars"
      this.displayedColumns = data.head.vars;

      // Map bindings to rows with dynamic key-value pairs
      const rows = data.results.bindings.map(binding => {
        const row: any = {};
        this.displayedColumns.forEach(col => {
          row[col] = binding.values[col]?.value || '';
        });
        return row;
      });

      // Update the table data source
      this.dataSource.data = rows;

      // Attach paginator after data source update
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  }

  checkSizeOfBindings(): boolean {
    if (this.result?.results !== null) {
      // @ts-ignore
      if (this.result.results.bindings.length > 0) {
        return true;
      } else return false;
    } else {
      return false;
    }
  }

  loadQueries(): void {
    this.dataService.loadSparqlQueries()
      .subscribe(
        {
          next: (data) => {
            this.sparqlQueries = data;
            console.log(data)
          },
          error: err => {
          alert(err)
          }
        }
      )
  }

  updateQuery(selectedQuery: SparqlQuery | null) {
    if (selectedQuery !== null) {
      this.sparqlQuery = selectedQuery.query;
      this.selectedQuery = selectedQuery;
    }
  }

  saveQuery(): void {

    console.log(this.selectedQuery)

    if (this.selectedQuery !== null) {
      this.selectedQuery.query = this.sparqlQuery;
      this.dataService.saveSparqlQuery(this.selectedQuery).subscribe(
        {
          next: (data) => {
            // this.selectedQuery = data;
            console.log(this.sparqlQueries)
          },
          error: err => {
            alert(err)
          }
        }
      )
    }
  }

  clearQuery(): void {
    this.selectedQuery = {
      id: 0,
      name: '',
      description: '',
      query: ''
    };

    this.sparqlQuery = '';
  }
}
