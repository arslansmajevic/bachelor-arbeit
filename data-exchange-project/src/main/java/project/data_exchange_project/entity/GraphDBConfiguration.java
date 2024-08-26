package project.data_exchange_project.entity;


import jakarta.persistence.*;
import lombok.*;

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

  @Column(name = "graph_db_url", nullable = false)
  private String graphDbServerUrl;

  @Column(name = "repository_id", nullable = false)
  private String repositoryId;

  @Column(name = "port", nullable = false)
  private Long port;

  @Column(name = "generated_url", nullable = false)
  private String generatedUrl;

  @PrePersist
  private void prePersist() {
    if (this.graphDbServerUrl != null && this.repositoryId != null && this.port != null) {
      this.generatedUrl = String.format("%s:%d/repositories/%s", this.graphDbServerUrl, this.port, this.repositoryId);
    }
  }
}
