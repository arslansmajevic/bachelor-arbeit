package project.dataexchangeproject.service;

import project.dataexchangeproject.rest.dto.CustomQueryDto;
import project.dataexchangeproject.rest.dto.SparqlResult;
import project.dataexchangeproject.rest.dto.node.ExpandingEdge;
import project.dataexchangeproject.rest.dto.node.GraphNode;

import java.util.List;

public interface GraphDBService {

  List<ExpandingEdge> expandNeighbouringNodes(GraphNode graphNode);

  List<ExpandingEdge> expandNode(GraphNode graphNode);

  List<String> autoCompleteName(String keyword, Integer limit);

  SparqlResult performCustomQuery(CustomQueryDto customQueryDto);
}
