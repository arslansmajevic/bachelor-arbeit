import { Component } from '@angular/core';
import {SparqlQuery, SparqlResult} from "../../../dtos/sparql/sparql";
import {ToastrService} from "ngx-toastr";
import {DataService} from "../../../services/data.service";

interface ChartData {
  id: number;
  name: string;
  results: any[];
  type: 'bar' | 'line' | 'pie' | 'area' | 'number-card'; // Supported chart types
  xAxisLabel: string;
}


@Component({
  selector: 'app-custom-statistics',
  templateUrl: './custom-statistics.component.html',
  styleUrls: ['./custom-statistics.component.css'] // Corrected property name
})
export class CustomStatisticsComponent {
  data: any[] = [];
  constructor(
    private dataService: DataService,
    private notification: ToastrService
  ) {}

  xAxisProperty: string = '';

  sparqlQuery = 'SELECT ?property (COUNT(DISTINCT ?literal) AS ?distinctLiteralCount)\n' +
    'WHERE {\n' +
    '  ?subject ?property ?literal .\n' +
    '  FILTER(isLiteral(?literal))\n' +
    '}\n' +
    'GROUP BY ?property\n' +
    'ORDER BY DESC(?distinctLiteralCount) \n';

  initialQueries: any[] = [
    {
      query: "SELECT \n" +
        "  (COUNT(DISTINCT ?property) AS ?totalProperties)\n" +
        "  ?property (COUNT(?property) AS ?propertyCount)\n" +
        "WHERE {\n" +
        "  ?subject ?property ?object .\n" +
        "}\n" +
        "GROUP BY ?property\n" +
        "ORDER BY DESC(?propertyCount)",
      name: "Count Properties"
    },
    {
      query: 'SELECT ?property (COUNT(DISTINCT ?literal) AS ?distinctLiteralCount)\n' +
        'WHERE {\n' +
        '  ?subject ?property ?literal .\n' +
        '  FILTER(isLiteral(?literal))\n' +
        '}\n' +
        'GROUP BY ?property\n' +
        'ORDER BY DESC(?distinctLiteralCount) \n',

      name: "Count Properties"
    }
  ]

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
  sparqlResult: SparqlResult = {head: null, results: null};

  ngOnInit() {
    this.loadQueries();

    for (let i = 0; i < this.initialQueries.length; i++) {
      this.sparqlQuery = this.initialQueries[i].query;
      this.executeQuery(true, this.initialQueries[i].name, 'property');
    }

    this.sparqlQuery = '';
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

  executeQuery(preload?: boolean, chartName?: string, xAxisProperty?: string) {
    if (!this.sparqlQuery.trim()) {
      this.notification.warning("Provide a query!");
      return;
    }

    if (this.xAxisProperty === '' && !xAxisProperty) {
      this.notification.warning("Provide a xAxis Property!!");
      return;
    }

    this.dataService.performCustomQuery(this.sparqlQuery)
      .subscribe({
        next: (data: SparqlResult) => {
          this.addChart(data, preload, chartName, xAxisProperty);
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

  loadQueries(): void {
    this.dataService.loadSparqlQueries()
      .subscribe(
        {
          next: (data) => {
            this.sparqlQueries = data;

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

  addChart(sparqlResult: SparqlResult, preload?: boolean, chartName?: string, xAxisProperty?: string): void {
    try {
      // Parse SPARQL result to chart data format
      var chartData = [];
      if (xAxisProperty) {
        chartData = this.parseSparqlResult(sparqlResult, xAxisProperty);
      } else {
        chartData = this.parseSparqlResult(sparqlResult, this.xAxisProperty);

      }

      if (chartData.length === 0) {
        return;
      }

      if (chartName) {
        this.charts.unshift({
          id: ++this.chartCounter,
          name: chartName,
          results: chartData,
          type: 'bar', // Default chart type
          xAxisLabel: this.xAxisProperty
        });
      } else {
        this.charts.unshift({
          id: ++this.chartCounter,
          name: this.chartName === '' ? `Chart ${this.chartCounter}` : this.chartName,
          results: chartData,
          type: 'bar', // Default chart type
          xAxisLabel: this.xAxisProperty
        });
      }

      this.chartName = '';

      if (!preload) {
        this.notification.success(`Chart ${this.chartCounter} added successfully!`);
      }
    } catch (error) {
      this.notification.error("Error parsing SPARQL result: ");
    }
  }

  parseSparqlResult(sparqlResult: SparqlResult, xAxisProperty: string): any[] {
    const vars = sparqlResult.head?.vars;
    const bindings = sparqlResult.results?.bindings;

    if (!vars || !bindings || !vars.includes(xAxisProperty)) {
      this.notification.warning("The data could not be parsed for chart!");
      return [];
    }

    const chartData: any[] = [];
    const seriesKeys = vars.filter((v) => v !== xAxisProperty); // All columns except xAxis

    // Group data by xAxisProperty
    bindings.forEach((binding: any) => {
      const xAxisValue = binding.values[xAxisProperty]?.value || "Unknown";

      const series = seriesKeys.map((key) => ({
        name: key,
        value: Number(binding.values[key]?.value || 0),
      }));

      chartData.push({
        name: xAxisValue.split('/').pop(), // Simplify URI if needed
        series: series,
      });
    });

    return chartData;
  }

  expandedChart: ChartData | null = null;

  expandChart(chartId: number): void {
    const chart = this.charts.find((c) => c.id === chartId);
    if (chart) {
      this.expandedChart = chart;
    }
  }

  closeExpandedChart(): void {
    this.expandedChart = null;
  }
}
