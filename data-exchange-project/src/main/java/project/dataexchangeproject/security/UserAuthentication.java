package project.dataexchangeproject.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import project.dataexchangeproject.repository.UserRepository;

import java.lang.invoke.MethodHandles;

@Component
public class UserAuthentication {
  private static final Logger log = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
  private final UserRepository userRepository;

  public UserAuthentication(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public Authentication getAuthentication() {
    return SecurityContextHolder.getContext().getAuthentication();
  }

  public String getEmail() {
    return this.getAuthentication().getName();
  }

  public boolean checkBlockedStatus(String userEmail) throws SecurityException {
    log.trace("Checking blocked status for {}", userEmail);
    if (userRepository.findApplicationUserByEmail(userEmail)
        == null) {
      throw new SecurityException("User with email "
          + userEmail
          + " is unknown");
    }

    if (userRepository.findApplicationUserByEmail(userEmail).isLocked()) {
      throw new SecurityException("User "
          + userEmail
          + " is blocked");
    }
    return true;
  }

  public void checkAdminRequest(String currentlyLoggedIn, String targetEmail) throws SecurityException {
    log.trace("Checking admin {} request for {}", currentlyLoggedIn, targetEmail);
    if (currentlyLoggedIn
        == null) {
      throw new SecurityException("Unknown user trying to access admin request");
    }

    if (currentlyLoggedIn.equals(targetEmail)) {
      throw new SecurityException(currentlyLoggedIn
          + " is an admin trying to block "
          + targetEmail);
    }
  }
}
