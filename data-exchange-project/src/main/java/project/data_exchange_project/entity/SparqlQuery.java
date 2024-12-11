package project.data_exchange_project.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SparqlQuery {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String name;

  @Column(length = 1000) // Adjust length if needed
  private String description;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String query;
}
