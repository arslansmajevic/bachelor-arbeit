package project.data_exchange_project.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
public class PersistenceUnavailableException extends RuntimeException {

  public PersistenceUnavailableException() {
    super("The database endpoint is currently unavailable.");
  }

  public PersistenceUnavailableException(String message) { super(message);}
}
