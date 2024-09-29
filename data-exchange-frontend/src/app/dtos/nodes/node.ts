export interface GraphNode {
  id: string;
  label: string;
  expanded: boolean;
}

export interface Link {
  source: string;
  target: string;
  label: string;
}
