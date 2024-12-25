package project.dataexchangeproject.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import project.dataexchangeproject.entity.GraphDBConfiguration;

@Repository
public interface GraphDBConfigRepository extends JpaRepository<GraphDBConfiguration, Long> {

  @Query("select g from GraphDBConfiguration g where g.id = 1")
  GraphDBConfiguration getDevGraphDBConfiguration();

  @Modifying
  @Transactional
  @Query("update GraphDBConfiguration g set g.graphDbServerUrl = :graphDbServerUrl, "
      + "g.repositoryId = :repositoryId, g.port = :port, g.generatedUrl = :generatedUrl where g.id = 1")
  void updateDatabaseConfig(String graphDbServerUrl, String repositoryId, Long port, String generatedUrl);
}
