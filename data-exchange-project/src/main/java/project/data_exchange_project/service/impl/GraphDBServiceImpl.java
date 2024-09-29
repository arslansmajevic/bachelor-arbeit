package project.data_exchange_project.service.impl;

import org.springframework.stereotype.Service;
import project.data_exchange_project.repository.GraphDbRepository;
import project.data_exchange_project.rest.dto.node.ExpandingEdge;
import project.data_exchange_project.rest.dto.node.GraphNode;
import project.data_exchange_project.rest.dto.patient.PatientDataDto;
import project.data_exchange_project.service.GraphDBService;

import java.util.List;

@Service
public class GraphDBServiceImpl implements GraphDBService {

  private final GraphDbRepository graphDbRepository;

  public GraphDBServiceImpl(GraphDbRepository graphDbRepository) {
    this.graphDbRepository = graphDbRepository;
  }

  @Override
  public List<PatientDataDto> getPatientData(String patientName) {

    return graphDbRepository.getPatientInformation();
  }

  @Override
  public List<ExpandingEdge> expandNeighbouringNodes(GraphNode graphNode) {
    return graphDbRepository.expandNode(graphNode.nodeUri());
  }
}
