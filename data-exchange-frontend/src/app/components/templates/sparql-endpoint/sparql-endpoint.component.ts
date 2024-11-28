import {Component, ViewChild} from '@angular/core';
import {DataService} from "../../../services/data.service";
import {SparqlResult} from "../../../dtos/sparql/sparql";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-sparql-endpoint',
  templateUrl: './sparql-endpoint.component.html',
  styleUrls: ['./sparql-endpoint.component.css']
})
export class SparqlEndpointComponent {
  sparqlQuery: string = 'SELECT ?s \n' +
    'WHERE { ?s ?p ?o .\n' +
    'FILTER ( CONTAINS( UCASE( STR( ?s ) ), UCASE( "observation" ) ) ) }\n' +
    'LIMIT 30'; // Query string entered by the user
  result: SparqlResult | null = null; // Stores the query result
  displayedColumns: string[] = []; // Table column headers
  dataSource = new MatTableDataSource<any>(); // Data source for MatTable
  @ViewChild(MatPaginator) paginator!: MatPaginator; // Reference to the paginator

  constructor(
    private dataService: DataService
  ) {}

  ngAfterViewInit() {
    // Ensure the paginator is attached after view initialization
    this.dataSource.paginator = this.paginator;
  }

  executeQuery() {
    if (!this.sparqlQuery.trim()) {
      alert('Please enter a SPARQL query.');
      return;
    }

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
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }

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
}
