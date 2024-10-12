import {Component, ElementRef, ViewChild} from '@angular/core';
import {Network} from "vis-network";
import {GraphNode} from "../../dtos/nodes/node";

@Component({
  selector: 'app-graph-vis-js',
  templateUrl: './graph-vis-js.component.html',
  styleUrl: './graph-vis-js.component.css'
})
export class GraphVisJsComponent {
  @ViewChild('visGraphContainer', { static: true }) visGraphContainer!: ElementRef;

  nodes: GraphNode[] = [
    { id: "http://fhir.org/Patient/1", label: "Patient/1", expanded: false}
  ];

  constructor() {}

  ngOnInit(): void {
    const nodes = [
      { id: 1, label: 'Node 1' },
      { id: 2, label: 'Node 2' },
      { id: 3, label: 'Node 3' },
      { id: 4, label: 'Node 4' },
      { id: 5, label: 'Node 5' }
    ];

    const edges = [
      { from: 1, to: 3 },
      { from: 1, to: 2 },
      { from: 2, to: 4 },
      { from: 2, to: 5 }
    ];

    const container = this.visGraphContainer.nativeElement;
    const data = { nodes, edges };
    const options = {};

    const network = new Network(container, data, options);
  }
}
