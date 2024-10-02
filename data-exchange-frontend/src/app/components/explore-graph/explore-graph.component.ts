import {Component, ViewChild} from '@angular/core';
import {D3ForceDirectedLayout, GraphComponent} from "@swimlane/ngx-graph";
import {GraphNode, Link} from "../../dtos/nodes/node";
import {DataService} from "../../services/data.service";
import { select } from 'd3-selection'
import 'd3-selection'

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
    if (!node.expanded) {
      node.expanded = true;
      const nodeInArray = this.nodes.find(existingNode => existingNode.id === node.id);
      if (nodeInArray) {
        nodeInArray.expanded = true;
      }
      let newNodes: GraphNode[] = [];
      let newLinks: Link[] = [];
      this.dataService.expandNeighbouringNodes(node.id).subscribe({
        next: (data: Link[]) => {
          for (let link of data) {
            let labelParts = link.source.split('/');
            let extractedLabel = labelParts.slice(-2).join('/'); // This will give 'Patient/1'

            let newNode: GraphNode = { id: link.source, label: extractedLabel, expanded: false };

            extractedLabel = link.label.substring(link.label.lastIndexOf('/') + 1);
            let newLink: Link = { source: link.source, target: link.target, label:  extractedLabel}

            if (!this.nodes.some(existingNode => existingNode.id === newNode.id)) {
              newNodes.push(newNode);
            }
            newLinks.push(newLink);
          }

          this.nodes = [...this.nodes, ...newNodes];
          this.links = [...this.links, ...newLinks];
        }
      });

      newNodes = [];
      newLinks = [];

      this.dataService.expandNode(node.id).subscribe({
        next: (data: Link[]) => {
          for (let link of data) {

            let newNode: GraphNode = { id: link.target, label: link.target, expanded: true };

            let extractedLabel = link.label.substring(link.label.lastIndexOf('/') + 1);
            let newLink: Link = { source: link.source, target: link.target, label:  extractedLabel}

            if (!this.nodes.some(existingNode => existingNode.id === newNode.id)) {
              newNodes.push(newNode);
            }
            newLinks.push(newLink);

          }

          this.nodes = [...this.nodes, ...newNodes];
          this.links = [...this.links, ...newLinks];
        }
      });
    }
  }


  updateGraph(): void {
    this.graph.update();
  }
}
