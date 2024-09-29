import {Component, ViewChild} from '@angular/core';
import {D3ForceDirectedLayout, GraphComponent} from "@swimlane/ngx-graph";
import {GraphNode, Link} from "../../dtos/nodes/node";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-explore-graph',
  templateUrl: './explore-graph.component.html',
  styleUrl: './explore-graph.component.css'
})
export class ExploreGraphComponent{

  d3ForceDirected = new D3ForceDirectedLayout();

  nodes: GraphNode[] = [
    { id: 'http://example.org/fhir/Patient/1', label: 'Patient/1', expanded: false }
  ];

  links: Link[] = [];

  constructor(
    private dataService: DataService
  ) {
  }

  @ViewChild(GraphComponent) graph!: GraphComponent;

  // Method to handle split area resize
  onResize(event: any): void {
    if (this.graph) {
      // Call the update method to trigger a redraw of the graph
      this.graph.update();
    }
  }

  onNodeDoubleClick(node: GraphNode): void {
    node.expanded = true;

    this.dataService.expandNode(node.id).subscribe({
      next: (data: Link[]) => {
        for (let link of data) {
          let newNode: GraphNode = { id: link.source, label: 'nesto', expanded: false };
          this.nodes = [...this.nodes, newNode]; // Spread operator to create a new array instance
          this.links = [...this.links, link];   // Same for links
        }

        // Update the graph after modifying the nodes and links
        this.updateGraph();
      }
    });

    console.log("nodes", this.nodes);
    console.log("links", this.links);
  }


  updateGraph(): void {
    this.graph.update();
  }
}
