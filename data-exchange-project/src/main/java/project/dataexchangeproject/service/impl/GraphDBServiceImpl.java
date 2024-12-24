package project.dataexchangeproject.service.impl;

import org.eclipse.rdf4j.query.MalformedQueryException;
import org.springframework.stereotype.Service;
import project.dataexchangeproject.exception.PersistenceUnavailableException;
import project.dataexchangeproject.repository.GraphDbRepository;
import project.dataexchangeproject.rest.dto.CustomQueryDto;
import project.dataexchangeproject.rest.dto.SparqlResult;
import project.dataexchangeproject.rest.dto.node.ExpandingEdge;
import project.dataexchangeproject.rest.dto.node.GraphNode;
import project.dataexchangeproject.service.GraphDBService;

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

  @Override
  public SparqlResult performCustomQuery(CustomQueryDto customQueryDto) {
    try {
      return graphDbRepository.performCustomQuery(customQueryDto.query());
    } catch (ConnectException c) {
      throw new PersistenceUnavailableException();
    } catch (MalformedQueryException m) {
      throw new MalformedQueryException();
    }
  }
}
