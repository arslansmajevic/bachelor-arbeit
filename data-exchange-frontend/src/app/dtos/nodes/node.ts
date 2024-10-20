export interface GraphNode {
  id: string;
  label: string;
  expanded: boolean;
  color?: string;
  shape?: string;
}

export interface Link {
  source: string;
  target: string;
  label: string;
}

export interface CustomPanel {
  title?: string;
  description?: string;
  subPanels?: CustomPanel[];
  color?: string;
}
