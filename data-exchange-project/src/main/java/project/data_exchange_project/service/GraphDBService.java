package project.data_exchange_project.service;

import project.data_exchange_project.rest.dto.node.ExpandingEdge;
import project.data_exchange_project.rest.dto.node.GraphNode;
import project.data_exchange_project.rest.dto.patient.PatientDataDto;

import java.util.List;

public interface GraphDBService {

  List<ExpandingEdge> expandNeighbouringNodes(GraphNode graphNode);

  List<ExpandingEdge> expandNode(GraphNode graphNode);

  List<String> autoCompleteName(String keyword, Integer limit);
}
