import {Component, ElementRef, ViewChild, OnInit, Input} from '@angular/core';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import {CustomPanel, GraphNode, Link} from "../../dtos/nodes/node";
import { DataService } from "../../services/data.service";
import {create} from "d3-selection";
import {forkJoin} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-graph-vis-js',
  templateUrl: './graph-vis-js.component.html',
  styleUrls: ['./graph-vis-js.component.css']
})
export class GraphVisJsComponent implements OnInit {
  @ViewChild('visGraphContainer', { static: true }) visGraphContainer!: ElementRef;
  @ViewChild('contextMenu', { static: true }) contextMenu!: ElementRef;

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
  previousNode = {nodeUri: "", color: ""};
  currentPanel: CustomPanel = {};

  @Input() firstNode: GraphNode[] = [{id: "null", label: "null", expanded: false}];

  rootNodes: GraphNode[] = [];
  panels: CustomPanel[] = [];

  constructor(
    private dataService: DataService,
    private router: Router
              ) {}

  ngOnInit(): void {
    this.firstNode = history.state.firstNode || { id: 'null', label: 'null', expanded: false };
    if (this.firstNode[0].id === 'null') {
      this.router.navigate(['search-instance'])
    }
    const container = this.visGraphContainer.nativeElement;
    this.nodesDataSet = new DataSet([])

    for (let node of this.firstNode) {
      this.nodesDataSet.add(
        { id: node.id, label: node.label, expanded: false }
      );
    }

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
          gravitationalConstant: -75,
          centralGravity: 0.015,
          springLength: 1,
          springConstant: 0.08,
          damping: 0.9
        },
        /*maxVelocity: 50,
        minVelocity: 0.1,
        stabilization: {
          enabled: false,
          iterations: 5,
          updateInterval: 25,
          onlyDynamicEdges: false,
          fit: true
        }*/
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

    // ignore same color clicks
    if (node.color === this.previousNode.color) {
      return;
    }

    // ignore same node clicks
    if (node.id === this.previousNode.nodeUri) {
      return;
    }

    if (node.color !== undefined && node.expanded === true) {
      this.showNode(nodeId, node.color)
      this.collapseNode(this.previousNode.nodeUri, this.previousNode.color)
      this.previousNode.nodeUri = nodeId;
      this.previousNode.color = node.color;

      this.appointCurrentPanel(node.label)
    } else {
      if (node && !node.expanded) {
        node.expanded = true;
        let randomColor = this.colors[this.groupId % 50];
        node.color = randomColor;
        node.group = this.groupId++;

        this.nodesDataSet.update(node);

        // Use forkJoin to wait for both API calls to complete
        forkJoin([
          this.dataService.expandNeighbouringNodes(nodeId), // First API call
          this.dataService.expandNode(nodeId)               // Second API call
        ]).subscribe(([neighbourData, nodeData]) => {
          // Handle neighboring nodes
          neighbourData.forEach((link) => {
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

            this.addEdgeToDataSet(link);
          });

          // Handle node expansion data
          nodeData.forEach((link) => {
            const sourceLabel = link.source.substring(link.source.lastIndexOf('/') + 1);
            const targetLabel = link.target.substring(link.target.lastIndexOf('/') + 1);

            // Add new nodes if they don't already exist
            if (!this.nodesDataSet.get(link.source)) {
              if (sourceLabel.startsWith('node')) {
                this.nodesDataSet.add({ id: link.source, expanded: true, shape: 'diamond', color: randomColor, group: this.groupId - 1 })
              } else {
                this.nodesDataSet.add({ id: link.source, expanded: true, color: randomColor, shape: 'box', group: this.groupId - 1 });
              }
            }
            if (!this.nodesDataSet.get(link.target)) {
              if (targetLabel.startsWith('node')) {
                this.nodesDataSet.add({ id: link.target, expanded: true, shape: 'diamond', color: randomColor, group: this.groupId - 1 });
              } else {
                this.nodesDataSet.add({ id: link.target, label: targetLabel, shape: 'box', expanded: true, color: randomColor, group: this.groupId - 1 });
              }
            }

            this.addEdgeToDataSet(link);
          });

          // After all data has been processed, print the graph data
          // this.printGraphData();
          this.panels.push(this.createPanelForInstance(nodeId, node.label, randomColor));
          this.appointCurrentPanel(node.label)
          if (this.previousNode.nodeUri !== "") {
            this.collapseNode(this.previousNode.nodeUri, this.previousNode.color)
            this.showNode(nodeId, node.color)
          }

          this.previousNode.nodeUri = nodeId;
          this.previousNode.color = randomColor;

        });
      }
    }
  }

  addEdgeToDataSet(link: Link): void {
    // Check if the edge already exists before adding it
    const existingEdges = this.edgesDataSet.get({
      filter: (edge: any) => edge.from === link.source && edge.to === link.target
    });

    if (existingEdges.length === 0) {
      // Edge does not exist, so add it
      let extractedLabel = link.label.substring(link.label.lastIndexOf('/') + 1);
      this.edgesDataSet.add({ from: link.source, to: link.target, label: extractedLabel });
    }
  }

  createPanelForInstance(nodeUri: string, nodeLabel: string, color?: string): CustomPanel {
    let tempPanel:CustomPanel = {title: nodeLabel, subPanels: [], color: color}
    this.edgesDataSet.forEach((edge: any) => {
      if (edge.from === nodeUri) {
        if (!edge.to.startsWith('node')) {
          tempPanel.subPanels?.push({title: edge.label, description: edge.to});
        } else {
          tempPanel.subPanels?.push( this.createPanelForInstance(edge.to, edge.label))
        }
      }
    })
    return tempPanel;
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

  collapseNode(prevNodeId: string, nodeColor: string): void {

    this.nodesDataSet.forEach( (node) => {

      if (node.color === nodeColor && node.id !== prevNodeId) {
        this.nodesDataSet.update( {id: node.id, hidden: true});
      }
    })
  }

  showNode(nodeId: string, nodeColor: string): void {
    this.nodesDataSet.forEach( (node) => {
      if (node.color === nodeColor) {
        this.nodesDataSet.update( {id: node.id, hidden: false, color: nodeColor})
      }
    })

    const connectedEdges = this.edgesDataSet.get({
      filter: (edge) => edge.from === nodeId,
    });

    connectedEdges.forEach((edge) => {
      this.nodesDataSet.forEach( (node) => {
        if (node.id === edge.to) {
          this.nodesDataSet.update({ id: edge.to, hidden: false, color: node.color } );
        }
      })
    });
  }

  appointCurrentPanel(nodeTitle: string): void {
    if (this.panels.find(panel => panel.title === nodeTitle) !== undefined) {
      // @ts-ignore
      this.currentPanel = this.panels.find(panel => panel.title === nodeTitle);
    }
  }

  expandAllNodes(): void {
    this.nodesDataSet.forEach((node) => {
      if (!node.color) {
        this.onNodeDoubleClick(node.id);
      }
    })
  }
}
