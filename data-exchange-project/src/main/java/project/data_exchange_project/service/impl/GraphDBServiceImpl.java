package project.data_exchange_project.service.impl;

import org.springframework.stereotype.Service;
import project.data_exchange_project.repository.GraphDbRepository;
import project.data_exchange_project.service.GraphDBService;

import java.util.List;

@Service
public class GraphDBServiceImpl implements GraphDBService {

  private final GraphDbRepository graphDbRepository;

  public GraphDBServiceImpl(GraphDbRepository graphDbRepository) {
    this.graphDbRepository = graphDbRepository;
  }

  @Override
  public String getPatientData() {
    graphDbRepository.executeSparqlQuery();
    List<String> movies = graphDbRepository.getMoviesForHuman1();

    System.out.println(movies);

    return "arslan";
  }
}
