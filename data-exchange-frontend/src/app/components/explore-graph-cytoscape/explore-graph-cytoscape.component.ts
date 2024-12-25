import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { GraphNode, Link } from '../../dtos/nodes/node';
import { DataService } from '../../services/data.service';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';

cytoscape.use(fcose);  // Register fcose layout

@Component({
  selector: 'app-explore-graph-cytoscape',
  templateUrl: './explore-graph-cytoscape.component.html',
  styleUrls: ['./explore-graph-cytoscape.component.css']
})
export class ExploreGraphCytoscapeComponent implements AfterViewInit {

  @ViewChild('cy') cyContainer!: ElementRef;

  cy!: cytoscape.Core;

  nodes: GraphNode[] = [
    { id: 'http://example.org/fhir/Patient/1', label: 'Patient/1', expanded: false}
  ];

  links: Link[] = [];

  fhirPrefix: string = 'http://example.org/fhir/';

  constructor(private dataService: DataService) {}

  ngAfterViewInit(): void {
    this.initializeGraph();
  }

  onResize(event: any): void {
    this.updateGraph();
  }

  initializeGraph(): void {
    this.cy = cytoscape({
      container: this.cyContainer.nativeElement, // Reference to the container
      elements: this.getGraphElements(), // Elements including nodes and edges
      style: [
        {
          selector: 'node',
          style: {
            'shape': 'rectangle',  // Makes nodes rectangular (can also use 'square')
            'width': 100,          // Width of the square node
            'height': 50,          // Height of the square node
            'background-color': '#007bff',  // Node background color
            'label': 'data(label)',  // Show label of the node
            'text-valign': 'center', // Align text vertically in the center
            'text-halign': 'center', // Align text horizontally in the center
            'color': '#fff',         // Text color
            'font-size': 12,         // Font size for the label
            'border-width': 2,       // Optional: add a border
            'border-color': '#000'    // Optional: border color
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,              // Width of the edge line
            'line-color': '#ccc',     // Edge line color
            'target-arrow-color': '#ccc',  // Arrow color
            'target-arrow-shape': 'triangle',  // Shape of the arrow
            'curve-style': 'bezier',  // Curve style for edges
            'label': 'data(label)'    // Optional: label for edges (if any)
          }
        }
      ],
      layout: {
        name: 'fcose',  // FCose layout for force-directed graph
        animate: true,  // Enable animation during layout
        randomize: false,  // Don't randomize the initial node positions
        fit: true,  // Fit the graph to the viewport
        padding: 400,  // Padding around the graph
        nodeRepulsion: 10000,  // Repulsion between nodes
        idealEdgeLength: 150,  // Ideal edge length for edges
      } as any
    });

    // Handle double-click on nodes
    this.cy.on('dblclick', 'node', (event) => {
      const node = event.target;
      this.onNodeDoubleClick(node.data());
    });
  }

  getGraphElements() {
    return [
      ...this.nodes.map(node => ({
        data: {
          id: node.id,
          label: node.label,
          color: node.color,  // Pass custom color
          shape: node.shape   // Pass custom shape
        }
      })),
      ...this.links.map(link => ({
        data: { source: link.source, target: link.target, label: link.label }
      }))
    ];
  }


  onNodeDoubleClick(nodeData: any): void {
    const node = this.nodes.find(n => n.id === nodeData.id);
    if (node && !node.expanded) {
      node.expanded = true;
      this.expandNode(node);
    }
  }

  expandNode(node: GraphNode): void {

    let newNodes: GraphNode[] = [];
    let newLinks: Link[] = [];

    this.dataService.expandNeighbouringNodes(node.id).subscribe({
      next: (data: Link[]) => {

        for (let link of data) {
          let labelParts = link.source.split('/');
          let extractedLabel = labelParts.slice(-2).join('/'); // Extracts label 'Patient/1'

          let newNode: GraphNode = { id: link.source, label: extractedLabel, expanded: false, color: '#FF0000' };

          let newLink: Link = {
            source: link.source,
            target: link.target,
            label: link.label.substring(link.label.lastIndexOf('/') + 1)
          };

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


        this.updateGraph();
      }
    });
  }

  updateGraph(): void {
    this.cy.elements().remove();  // Clear existing graph elements
    this.cy.add(this.getGraphElements());  // Add new nodes and edges
    this.cy.layout({ name: 'fcose'}).run();  // Reapply the layout
  }
}
