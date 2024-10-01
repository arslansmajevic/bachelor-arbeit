import { D3ForceDirectedLayout } from "@swimlane/ngx-graph";
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';

// Custom force-directed layout with increased link distance
export class CustomD3ForceDirectedLayout extends D3ForceDirectedLayout {

  createSimulation(nodes: any[], links: any[]) {
    return forceSimulation(nodes)
      .force("link", forceLink(links).id((d: any) => d.id).distance(500)) // Set link distance here
      .force("charge", forceManyBody())
      .force("center", forceCenter(200, 200)); // Adjust as needed
  }
}
