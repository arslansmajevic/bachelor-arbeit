package project.data_exchange_project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import project.data_exchange_project.entity.SparqlQuery;

public interface SparqlQueryRepository extends JpaRepository<SparqlQuery, Long> {

  @Transactional
  @Modifying
  @Query("UPDATE SparqlQuery s SET s.name = :name, s.query = :query, s.description = :description WHERE s.id = :id")
  void updateSparqlQuery(@Param("id") Long id, @Param("name") String name, @Param("description") String description, @Param("query") String query);

}
