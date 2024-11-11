package project.data_exchange_project.datagenerator;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import project.data_exchange_project.entity.GraphDBConfiguration;
import project.data_exchange_project.repository.GraphDBConfigRepository;

import java.lang.invoke.MethodHandles;

@Profile("generateData")
@Component
public class GraphDBConfigGenerator {
  private static final Logger log = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
  private final GraphDBConfigRepository graphDBConfigRepository;

  public GraphDBConfigGenerator(GraphDBConfigRepository graphDBConfigRepository) {
    this.graphDBConfigRepository = graphDBConfigRepository;
  }

  @PostConstruct
  public void generateInitialConfig() {
    if (!graphDBConfigRepository.findAll().isEmpty()) {
      log.info("GraphDB Config has been generated...");
    } else {
      GraphDBConfiguration graphDBConfiguration = GraphDBConfiguration.builder()
              .port(7200L)
              .graphDbServerUrl("http://localhost")
              .repositoryId("prof-data-repo")
              .build();

      graphDBConfigRepository.save(graphDBConfiguration);
    }
  }
}
