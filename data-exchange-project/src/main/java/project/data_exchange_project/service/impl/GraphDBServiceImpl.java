package project.data_exchange_project.service.impl;

import org.eclipse.rdf4j.query.MalformedQueryException;
import org.eclipse.rdf4j.repository.RepositoryException;
import org.springframework.stereotype.Service;
import project.data_exchange_project.exception.PersistenceUnavailableException;
import project.data_exchange_project.repository.GraphDbRepository;
import project.data_exchange_project.rest.dto.node.ExpandingEdge;
import project.data_exchange_project.rest.dto.node.GraphNode;
import project.data_exchange_project.service.GraphDBService;

import java.net.ConnectException;
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
    try {
      return graphDbRepository.expandNeighbouringNodes(graphNode.nodeUri());
    } catch (ConnectException c) {
      throw new PersistenceUnavailableException();
    } catch (MalformedQueryException m) {
      throw new MalformedQueryException();
    }
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
