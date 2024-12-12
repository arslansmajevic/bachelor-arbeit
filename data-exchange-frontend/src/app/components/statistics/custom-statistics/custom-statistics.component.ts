import { Component } from '@angular/core';
import {SparqlQuery, SparqlResult} from "../../../dtos/sparql/sparql";
import {ToastrService} from "ngx-toastr";
import {DataService} from "../../../services/data.service";

@Component({
  selector: 'app-custom-statistics',
  templateUrl: './custom-statistics.component.html',
  styleUrls: ['./custom-statistics.component.css'] // Corrected property name
})
export class CustomStatisticsComponent {
  data: any[] = [];
  view: [number, number] = [1200, 550]; // Chart dimensions

  constructor(
    private dataService: DataService,
    private notification: ToastrService
  ) {}

  // Chart options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Property';
  showYAxisLabel = true;
  yAxisLabel = 'Distinct Literal Count';
  colorScheme = { domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'] };
  sparqlQuery = '';

  sparqlQueries: SparqlQuery[] = [];
  selectedQuery: SparqlQuery = {
    id: 0,
    name: '',
    description: '',
    query: ''
  };

  ngOnInit() {
    this.loadQueries();
  }



  clearQuery(): void {
    this.sparqlQuery = '';
  }

  executeQuery() {
    if (!this.sparqlQuery.trim()) {
      this.notification.warning("Provide a query!");
      return;
    }

    this.dataService.performCustomQuery(this.sparqlQuery)
      .subscribe({
        next: (data: SparqlResult) => {
          this.drawChart(data);
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

  drawChart(sparqlResult: any): void {
    // Transform SPARQL data into ngx-charts format
    try {
      this.data = [];
      this.data = sparqlResult.results.bindings.map((binding: any) => ({
        name: binding.values.property.value.split('/').pop(), // Extract property name
        value: Number(binding.values.distinctLiteralCount.value) // Parse literal count as number
      }));
    } catch (error) {
      this.notification.error("This query could not be presented on a chart!")
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
}
