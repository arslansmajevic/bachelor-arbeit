import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { GraphNode, Link } from "../../dtos/nodes/node";
import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-graph-vis-js',
  templateUrl: './graph-vis-js.component.html',
  styleUrls: ['./graph-vis-js.component.css']
})
export class GraphVisJsComponent implements OnInit {
  @ViewChild('visGraphContainer', { static: true }) visGraphContainer!: ElementRef;

  nodesDataSet!: DataSet<any>;
  edgesDataSet!: DataSet<any>;
  network!: Network;

  nodes: GraphNode[] = [
    { id: 'http://example.org/fhir/Patient/1', label: 'Patient/1', expanded: false }
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    const container = this.visGraphContainer.nativeElement;

    this.nodesDataSet = new DataSet([
      { id: 'http://example.org/fhir/Patient/1', label: 'Patient/1', expanded: false }
    ]);

    this.edgesDataSet = new DataSet([]);

    const data = {
      nodes: this.nodesDataSet,
      edges: this.edgesDataSet
    };

    const options = {
      physics: {
        enabled: true,
        repulsion: {
          nodeDistance: 150, // Increase the distance between nodes
          springLength: 120,  // Increase the length of edges, which helps spread nodes
          springConstant: 0.05, // Controls the stiffness of edges (lower = more flexible)
        },
        solver: 'repulsion'
      },
      layout: {
        improvedLayout: true // Let vis.js improve the layout spacing
      },
      edges: {
        arrows: {
          to: { enabled: true, scaleFactor: 1 } // Add arrows pointing to the target node
        }
      }
    };


    this.network = new Network(container, data, options);

    // Handle double-click event to expand nodes
    this.network.on('doubleClick', (params) => {
      const nodeId = params.nodes[0];
      if (nodeId) {
        this.onNodeDoubleClick(nodeId);
      }
    });

  }

  onNodeDoubleClick(nodeId: string): void {
    const node = this.nodesDataSet.get(nodeId);
    if (node && !node.expanded) {
      node.expanded = true;
      this.nodesDataSet.update(node);

      // Fetch neighboring nodes and links (replace this with actual logic to fetch data)
      this.dataService.expandNeighbouringNodes(nodeId).subscribe((data: Link[]) => {
        data.forEach((link) => {
          let labelPartsSource = link.source.split('/');
          let extractedLabelSource = labelPartsSource.slice(-2).join('/'); // This will give 'Patient/1'

          let labelPartsTarget = link.target.split('/');
          let extractedLabelTarget = labelPartsTarget.slice(-2).join('/'); // This will give 'Patient/1'

          // Add new nodes if they don't already exist
          if (!this.nodesDataSet.get(link.source)) {
            this.nodesDataSet.add({ id: link.source, label: extractedLabelSource, expanded: false });
          }
          if (!this.nodesDataSet.get(link.target)) {
            this.nodesDataSet.add({ id: link.target, label: extractedLabelTarget, expanded: false });
          }

          let extractedLabel = link.label.substring(link.label.lastIndexOf('/') + 1);
          // Check if the edge already exists before adding it
          const existingEdges = this.edgesDataSet.get({
            filter: (edge: any) => edge.from === link.source && edge.to === link.target
          });

          if (existingEdges.length === 0) {
            // Edge does not exist, so add it
            let extractedLabel = link.label.substring(link.label.lastIndexOf('/') + 1);
            this.edgesDataSet.add({ from: link.source, to: link.target, label: extractedLabel });
          }

        });
      });

      // Fetch additional data (as per your original logic)
      this.dataService.expandNode(nodeId).subscribe((data: Link[]) => {
        data.forEach((link) => {
          const sourceLabel = link.source.substring(link.source.lastIndexOf('/') + 1);
          const targetLabel = link.target.substring(link.target.lastIndexOf('/') + 1);

          let extractedLabel = link.label.substring(link.label.lastIndexOf('/') + 1);

          // Add new nodes if they don't already exist
          if (!this.nodesDataSet.get(link.source)) {
            this.nodesDataSet.add({ id: link.source, label: sourceLabel, expanded: false });
          }
          if (!this.nodesDataSet.get(link.target)) {
            this.nodesDataSet.add({ id: link.target, label: targetLabel, expanded: false });
          }

          // Check if the edge already exists before adding it
          const existingEdges = this.edgesDataSet.get({
            filter: (edge: any) => edge.from === link.source && edge.to === link.target
          });

          if (existingEdges.length === 0) {
            // Edge does not exist, so add it
            let extractedLabel = link.label.substring(link.label.lastIndexOf('/') + 1);
            this.edgesDataSet.add({ from: link.source, to: link.target, label: extractedLabel });
          }
        });
      });
    }
  }
}
