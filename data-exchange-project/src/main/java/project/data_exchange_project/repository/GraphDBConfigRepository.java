package project.data_exchange_project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import project.data_exchange_project.entity.GraphDBConfiguration;

@Repository
public interface GraphDBConfigRepository extends JpaRepository<GraphDBConfiguration, Long> {

  @Query("select g from GraphDBConfiguration g where g.id = 1")
  GraphDBConfiguration getDevGraphDBConfiguration();
}
