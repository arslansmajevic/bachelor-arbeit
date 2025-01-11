package project.dataexchangeproject.config.database;

import org.eclipse.rdf4j.repository.sparql.SPARQLRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Scope;
import project.dataexchangeproject.repository.GraphDBConfigRepository;

@Configuration
public class GraphDBConfig {

  private final GraphDBConfigRepository graphDBConfigRepository;

  public GraphDBConfig(GraphDBConfigRepository graphDBConfigRepository) {
    this.graphDBConfigRepository = graphDBConfigRepository;
  }

  @Bean
  @Lazy
  public SPARQLRepository sparqlRepository() {
    System.out.println("This graphDB repo: " + graphDBConfigRepository.getDevGraphDBConfiguration().getGeneratedUrl());
    String sparqlEndpoint = graphDBConfigRepository.getDevGraphDBConfiguration().getGeneratedUrl();
    SPARQLRepository sparqlRepository = new SPARQLRepository(sparqlEndpoint);
    sparqlRepository.init();
    return sparqlRepository;
  }
}
