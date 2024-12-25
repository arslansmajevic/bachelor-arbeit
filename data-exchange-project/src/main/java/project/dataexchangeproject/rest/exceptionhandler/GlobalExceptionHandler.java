package project.dataexchangeproject.rest.exceptionhandler;

import org.eclipse.rdf4j.query.MalformedQueryException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import project.dataexchangeproject.exception.ErrorResponse;
import project.dataexchangeproject.exception.NotFoundException;

import java.lang.invoke.MethodHandles;
import java.net.ConnectException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Register all your Java exceptions here to map them into meaningful HTTP exceptions
 * If you have special cases which are only important for specific endpoints, use ResponseStatusExceptions
 * https://www.baeldung.com/exception-handling-for-rest-with-spring#responsestatusexception
 */
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

  private static final Logger log = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

  /**
   * Use the @ExceptionHandler annotation to write handler for custom exceptions.
   */
  @ExceptionHandler(value = {NotFoundException.class})
  protected ResponseEntity<Object> handleNotFound(RuntimeException ex, WebRequest request) {
    log.warn(ex.getMessage());
    return handleExceptionInternal(ex, ex.getMessage(), new HttpHeaders(), HttpStatus.NOT_FOUND, request);
  }

  /**
   * Override methods from ResponseEntityExceptionHandler to send a customized HTTP response for a know exception
   * from e.g. Spring
   */
  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                HttpHeaders headers,
                                                                HttpStatusCode status, WebRequest request) {
    Map<String, Object> body = new LinkedHashMap<>();
    //Get all errors
    List<String> errors = ex.getBindingResult()
        .getFieldErrors()
        .stream()
        .map(err -> err.getField()
            + " "
            + err.getDefaultMessage())
        .collect(Collectors.toList());
    body.put("Validation errors", errors);

    return new ResponseEntity<>(body.toString(), headers, status);

  }

  @ExceptionHandler(ConnectException.class)
  public ResponseEntity<ErrorResponse> handlePersistenceUnavailableException(ConnectException ex) {
    ErrorResponse errorResponse = new ErrorResponse(
        "Service Unavailable",
        ex.getMessage(),
        HttpStatus.SERVICE_UNAVAILABLE.value()
    );
    return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errorResponse);
  }

  @ExceptionHandler(MalformedQueryException.class)
  public ResponseEntity<ErrorResponse> handleMalformedQueryException(MalformedQueryException ex) {
    ErrorResponse errorResponse = new ErrorResponse(
        "Malformed Query",
        ex.getMessage(),
        HttpStatus.BAD_REQUEST.value()
    );
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  }
}