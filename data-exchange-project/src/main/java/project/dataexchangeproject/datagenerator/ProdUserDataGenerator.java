package project.dataexchangeproject.datagenerator;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import project.dataexchangeproject.entity.ApplicationUser;
import project.dataexchangeproject.repository.UserRepository;

import java.lang.invoke.MethodHandles;

@Profile("productionData")
@Component
public class ProdUserDataGenerator {

  private static final Logger log = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
  private final UserRepository userRepository;
  private String password = "password";

  public ProdUserDataGenerator(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.password = passwordEncoder.encode(password);
  }

  @PostConstruct
  public void generateUsers() {
    if (!userRepository.findAll().isEmpty()) {
      log.info("Users have been generated...");
    } else {
      log.info("Generating users...");

      ApplicationUser adminUser = ApplicationUser.builder()
          .email("admin@admin.com")
          .password(password)
          .firstName("Admin")
          .lastName("Admin")
          .isAdmin(Boolean.TRUE)
          .isLocked(Boolean.FALSE)
          .loginAttempts(0)
          .isPending(false)
          .build();

      userRepository.save(adminUser);
    }
  }
}
