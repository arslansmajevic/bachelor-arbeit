package project.data_exchange_project.config.database;

import org.eclipse.rdf4j.repository.sparql.SPARQLRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import project.data_exchange_project.repository.GraphDBConfigRepository;

@Configuration
public class GraphDBConfig {

  private String graphDbServerUrl;
  private String repositoryId;
  private final GraphDBConfigRepository graphDBConfigRepository;

  public GraphDBConfig(GraphDBConfigRepository graphDBConfigRepository) {
    this.graphDBConfigRepository = graphDBConfigRepository;
  }

  @Bean
  public SPARQLRepository sparqlRepository() {
    // String sparqlEndpoint = graphDbServerUrl + "/repositories/" + repositoryId;
    String sparqlEndpoint = graphDBConfigRepository.getDevGraphDBConfiguration().getGeneratedUrl();
    SPARQLRepository sparqlRepository = new SPARQLRepository(sparqlEndpoint);
    sparqlRepository.init();
    return sparqlRepository;
  }

  public void changeGraphDbSource(String newServerUrl, String newRepositoryId) {
    this.graphDbServerUrl = newServerUrl;
    this.repositoryId = newRepositoryId;
  }
}
