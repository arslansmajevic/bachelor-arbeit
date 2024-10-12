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
    // { id: 'http://example.org/fhir/Encounter/Encounter1', label: 'Encounter/Encounter1', expanded: false }
    // { id: 'http://example.org/fhir/Patient/1', label: 'Patient/1', expanded: false }
  ];

  links: Link[] = [];
  fhirPrefix: string = "http://example.org/fhir/";

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

            // for nodes
            let newNodeTarget: GraphNode = { id: link.target, label: link.target, expanded: !link.target.startsWith(this.fhirPrefix) };
            let newNodeSource: GraphNode = { id: link.source, label: link.source, expanded: !link.source.startsWith(this.fhirPrefix) };

            // for link
            let extractedLabel = link.label.substring(link.label.lastIndexOf('/') + 1);
            let newLink: Link = { source: link.source, target: link.target, label:  extractedLabel}

            // Add the target node if it doesn't already exist in the graph
            if (!this.nodes.some(existingNode => existingNode.id === newNodeTarget.id) &&
              !newNodes.some(existingNode => existingNode.id === newNodeTarget.id)) {
              newNodes.push(newNodeTarget);
            }

            // Add the source node if it doesn't already exist in the graph
            if (!this.nodes.some(existingNode => existingNode.id === newNodeSource.id) &&
              !newNodes.some(existingNode => existingNode.id === newNodeSource.id)) {
              newNodes.push(newNodeSource);
            }

            // Add the link if it doesn't already exist in the graph
            if (!this.links.some(existingLink =>
                existingLink.source === newLink.source &&
                existingLink.target === newLink.target &&
                existingLink.label === newLink.label) &&
              !newLinks.some(existingLink =>
                existingLink.source === newLink.source &&
                existingLink.target === newLink.target &&
                existingLink.label === newLink.label)) {
              newLinks.push(newLink);
            }

          }

          this.nodes = [...this.nodes, ...newNodes];
          this.links = [...this.links, ...newLinks];

          console.log(this.nodes)
          console.log(this.links)
        }
      });
    }
  }


  updateGraph(): void {
    this.graph.update();
  }
}
