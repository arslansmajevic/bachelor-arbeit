package project.dataexchangeproject.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GraphDBConfiguration {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "graph_db_url",
      nullable = false)
  private String graphDbServerUrl;

  @Column(name = "repository_id",
      nullable = false)
  private String repositoryId;

  @Column(name = "port",
      nullable = false)
  private Long port;

  @Column(name = "generated_url",
      nullable = false)
  private String generatedUrl;

  @PrePersist
  private void prePersist() {
    if (this.graphDbServerUrl
        != null
        && this.repositoryId
        != null
        && this.port
        != null) {
      this.generatedUrl = String.format("%s:%d/repositories/%s", this.graphDbServerUrl, this.port, this.repositoryId);
    }
  }
}
