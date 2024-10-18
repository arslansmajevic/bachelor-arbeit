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
  groupId: number = 0;
  colors: string[] = [
    '#FFB6C1', // Light Pink
    '#FFDAB9', // Peach Puff
    '#FFFACD', // Lemon Chiffon
    '#E6E6FA', // Lavender
    '#F0FFF0', // Honeydew
    '#F5FFFA', // Mint Cream
    '#FFF0F5', // Lavender Blush
    '#FFE4E1', // Misty Rose
    '#FFF8DC', // Cornsilk
    '#FAFAD2', // Light Goldenrod Yellow
    '#FFEFD5', // Papaya Whip
    '#FFF5EE', // Seashell
    '#F0E68C', // Khaki
    '#E0FFFF', // Light Cyan
    '#AFEEEE', // Pale Turquoise
    '#B0E0E6', // Powder Blue
    '#ADD8E6', // Light Blue
    '#D3D3D3', // Light Gray
    '#F5F5DC', // Beige
    '#F8F8FF', // Ghost White
    '#FDF5E6', // Old Lace
    '#F0F8FF', // Alice Blue
    '#FAEBD7', // Antique White
    '#FAF0E6', // Linen
    '#F0FFFF', // Azure
    '#FFFAF0', // Floral White
    '#FFFFE0', // Light Yellow
    '#E0E0E0', // Gainsboro
    '#E6F2FF', // Soft Blue
    '#F7F7F7', // Snow White
    '#FFFACD', // Light Butter
    '#E0FFF4', // Light Mint
    '#D1F2EB', // Mint Splash
    '#FEF9E7', // Soft Cream
    '#D5DBDB', // Light Gray
    '#FFEBCD', // Blanched Almond
    '#F4A460', // Sandy Brown
    '#DEB887', // Burly Wood
    '#FFD700', // Gold
    '#F0E68C', // Light Khaki
    '#E9ECEF', // Soft Gray
    '#E5E4E2', // Platinum
    '#E3F2FD', // Light Blue
    '#DFF9FB', // Light Aqua
    '#D1C4E9', // Soft Purple
    '#FFCCCB', // Light Coral
    '#F3E5F5', // Thistle
    '#FFEBEE', // Soft Pink
    '#FFF3E0', // Soft Orange
    '#FDFEFE'  // Soft White
    ];

  nodes: GraphNode[] = [
    { id: 'http://example.org/fhir/Patient/1', label: 'Patient/1', expanded: false }
    /*{ id: 'http://example.org/fhir/Patient/T1357', label: 'Patient/T1357', expanded: false }*/
  ];

  rootNodes: GraphNode[] = [
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
        solver: 'forceAtlas2Based', // You can keep physics settings or disable them for a static layout
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springLength: 100,
          springConstant: 0.08,
          damping: 0.4
        },
        maxVelocity: 50,
        minVelocity: 0.1,
        stabilization: {
          enabled: true,
          iterations: 1000,
          updateInterval: 25,
          onlyDynamicEdges: false,
          fit: true
        }
      },
      layout: {
        hierarchical: false,           // Disable hierarchical layout
        improvedLayout: true,          // Keeps this to prevent overlap
        randomSeed: undefined,         // Optional, allows for reproducible results if a seed is provided
        circular: {                    // Enable circular layout
          enabled: true,               // Ensure circular layout is active
          sortMethod: 'hubsize'        // Sort by 'hubsize' or 'directed'
        }
      },
      edges: {
        arrows: {
          to: { enabled: true, scaleFactor: 1 } // Adds arrows to edges
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
      let randomColor = this.colors[this.groupId % 50];
      node.color = randomColor;
      node.group = this.groupId++;

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
            this.rootNodes.push({ id: link.source, label: extractedLabelSource, expanded: false });
          }
          if (!this.nodesDataSet.get(link.target)) {
            this.nodesDataSet.add({ id: link.target, label: extractedLabelTarget, expanded: false });
            this.rootNodes.push({ id: link.source, label: extractedLabelSource, expanded: false });
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
            if (sourceLabel.startsWith('node')) {
              this.nodesDataSet.add({ id: link.source, expanded: true, shape: 'diamond', color: randomColor, group: this.groupId - 1 })
            } else {
              this.nodesDataSet.add({ id: link.source, expanded: true, color: randomColor, group: this.groupId - 1 });
            }
          }
          if (!this.nodesDataSet.get(link.target)) {
            if (targetLabel.startsWith('node')) {
              this.nodesDataSet.add({ id: link.target, expanded: true, shape: 'diamond', color: randomColor, group: this.groupId - 1 });
            } else {
              this.nodesDataSet.add({ id: link.target, label: targetLabel, expanded: true, color: randomColor, group: this.groupId - 1 });
            }
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
    this.printGraphData();
  }

  printGraphData(): void {
    console.log("Nodes:");
    this.nodesDataSet.forEach(node => {
      console.log(node);
    });

    console.log("Edges:");
    this.edgesDataSet.forEach(edge => {
      console.log(edge);
    });
  }

  selectNeighbouringNodesOfRootNode(graphNode: GraphNode): GraphNode[] {
    // Filter edges where the 'from' field matches the graphNode.id
    const relatedEdges = this.edgesDataSet.get({
      filter: (edge: any) => edge.from === graphNode.id
    });

    // Collect the neighboring nodes based on the edges
    const neighbouringNodes: GraphNode[] = [];
    relatedEdges.forEach((edge: any) => {
      neighbouringNodes.push({ id: edge.to, label: edge.label, expanded: true })
    });

    return neighbouringNodes;
  }


}
