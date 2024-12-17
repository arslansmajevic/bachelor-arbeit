import { Component } from '@angular/core';
import {SparqlQuery, SparqlResult} from "../../../dtos/sparql/sparql";
import {ToastrService} from "ngx-toastr";
import {DataService} from "../../../services/data.service";

interface ChartData {
  id: number;
  name: string;
  results: any[];
  type: 'bar' | 'line' | 'pie' | 'area' | 'number-card'; // Supported chart types
}


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
  sparqlQuery = 'SELECT ?property (COUNT(DISTINCT ?literal) AS ?distinctLiteralCount)\n' +
    'WHERE {\n' +
    '  ?subject ?property ?literal .\n' +
    '  FILTER(isLiteral(?literal))\n' +
    '}\n' +
    'GROUP BY ?property\n' +
    'ORDER BY DESC(?distinctLiteralCount) \n';

  sparqlQueries: SparqlQuery[] = [];
  selectedQuery: SparqlQuery = {
    id: 0,
    name: '',
    description: '',
    query: ''
  };

  charts: ChartData[] = []; // Array of charts
  chartCounter = 0; // Unique chart IDs
  chartName: string = '';

  ngOnInit() {
    this.loadQueries();
  }

  clearQuery(): void {
    this.sparqlQuery = '';
    this.selectedQuery = {
      id: 0,
      name: '',
      description: '',
      query: ''
    };
  }

  executeQuery() {
    if (!this.sparqlQuery.trim()) {
      this.notification.warning("Provide a query!");
      return;
    }

    this.dataService.performCustomQuery(this.sparqlQuery)
      .subscribe({
        next: (data: SparqlResult) => {
          this.addChart(data);
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

  addChart(sparqlResult: any): void {
    try {
      const chartData = sparqlResult.results.bindings.map((binding: any) => ({
        name: binding.values.property.value.split('/').pop(),
        value: Number(binding.values.distinctLiteralCount.value)
      }));

      this.charts.unshift({
        id: ++this.chartCounter,
        name: this.chartName === '' ? `Chart ${this.chartCounter}` : this.chartName,
        results: chartData,
        type: 'bar' // Default chart type
      });

      this.chartName = '';

      this.notification.success(`Chart ${this.chartCounter} added successfully!`);
    } catch (error) {
      this.notification.error("This query could not be presented on a chart!");
    }
  }

  clearCharts(): void {
    this.charts = [];
    this.notification.info("All charts cleared.");
  }
}
