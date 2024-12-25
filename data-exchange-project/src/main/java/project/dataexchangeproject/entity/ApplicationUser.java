package project.dataexchangeproject.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class ApplicationUser {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false,
      unique = true)
  private String email;

  @Column(name = "first_name",
      nullable = false)
  private String firstName;

  @Column(name = "last_name",
      nullable = false)
  private String lastName;

  @Column(nullable = false)
  private String password;

  @Column(name = "is_admin",
      nullable = false)
  private boolean isAdmin;

  @Column(name = "login_attempts",
      nullable = false)
  private int loginAttempts;

  @Column(name = "is_locked",
      nullable = false)
  private boolean isLocked;

  @Column(name = "login_pending",
      nullable = false)
  private boolean isPending;
}
