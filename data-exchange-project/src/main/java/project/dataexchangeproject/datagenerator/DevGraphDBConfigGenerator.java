package project.dataexchangeproject.datagenerator;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import project.dataexchangeproject.entity.GraphDBConfiguration;
import project.dataexchangeproject.repository.GraphDBConfigRepository;

import java.lang.invoke.MethodHandles;

@Profile("generateData")
@Component
public class DevGraphDBConfigGenerator {
  private static final Logger log = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
  private final GraphDBConfigRepository graphDBConfigRepository;

  public DevGraphDBConfigGenerator(GraphDBConfigRepository graphDBConfigRepository) {
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

      /*GraphDBConfiguration graphDBConfiguration = GraphDBConfiguration.builder()
              .port(7200L)
              .graphDbServerUrl("http://localhost")
              .repositoryId("a-self-made-fhir-ttl")
              .build();*/

      graphDBConfigRepository.save(graphDBConfiguration);
    }
  }
}
