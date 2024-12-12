import {Component, ViewChild} from '@angular/core';
import {DataService} from "../../../services/data.service";
import {SparqlQuery, SparqlResult} from "../../../dtos/sparql/sparql";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ToastrService} from "ngx-toastr";

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
    private dataService: DataService,
    private notification: ToastrService
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadQueries();
  }

  executeQuery() {
    if (!this.sparqlQuery.trim()) {
      this.notification.warning("Provide a query!");
      return;
    }

    this.dataService.performCustomQuery(this.sparqlQuery)
      .subscribe({
        next: (data: SparqlResult) => {
          this.result = data;
          this.processSparqlResponse(data);
        },
        error: err => {

          if (err.status === 400) {
            this.notification.error(err.error.error + ' | ' + err.error.message);
          } else {
            this.notification.error(err.error.error)
          }
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
          this.notification.error(err.error)
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

    if (this.sparqlQuery === '' || this.sparqlQuery === null) {
      this.notification.warning("SPARQL query was not provided!")
      return;
    }


    if (this.selectedQuery !== null) {
      if (this.selectedQuery.name === '' || this.selectedQuery.name === undefined) {
        this.notification.warning("Name for query was not provided")
        return;
      }

      this.selectedQuery.query = this.sparqlQuery;
      this.dataService.saveSparqlQuery(this.selectedQuery).subscribe(
        {
          next: (data) => {
            // this.selectedQuery = data;
            this.sparqlQueries.push(data);
            this.notification.success(data.name + " has been saved!")
            this.selectedQuery = data;
          },
          error: err => {
            this.notification.error(err.error)
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
