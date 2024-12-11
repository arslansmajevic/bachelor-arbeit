export interface SparqlResult {
  head: Head | null;
  results: Results | null;
}

export interface Head {
  vars: string[];
}

export interface Results {
  bindings: Bindings[];
}

export interface Bindings {
  values: { [key: string]: Value };
}

export interface Value {
  type: string;
  value: string;
}

export interface SparqlQuery {
  id?: number;
  name: string;
  description: string;
  query: string;
}
