package project.data_exchange_project.service.impl;

import org.springframework.stereotype.Service;
import project.data_exchange_project.repository.GraphDbRepository;
import project.data_exchange_project.rest.dto.node.ExpandingEdge;
import project.data_exchange_project.rest.dto.node.GraphNode;
import project.data_exchange_project.service.GraphDBService;

import java.util.List;
import java.util.Objects;

@Service
public class GraphDBServiceImpl implements GraphDBService {

  private final GraphDbRepository graphDbRepository;

  public GraphDBServiceImpl(GraphDbRepository graphDbRepository) {
    this.graphDbRepository = graphDbRepository;
  }

  @Override
  public List<ExpandingEdge> expandNeighbouringNodes(GraphNode graphNode) {
    return graphDbRepository.expandNeighbouringNodes(graphNode.nodeUri());
  }

  @Override
  public List<ExpandingEdge> expandNode(GraphNode graphNode) {
    return graphDbRepository.expandNode(graphNode.nodeUri());
  }

  @Override
  public List<String> autoCompleteName(String keyword, Integer limit) {
    return graphDbRepository.autocompleteInstances(keyword, Objects.requireNonNullElse(limit, 10));
  }
}
