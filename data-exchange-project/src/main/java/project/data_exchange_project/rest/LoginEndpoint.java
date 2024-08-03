package project.data_exchange_project.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.annotation.security.PermitAll;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import project.data_exchange_project.rest.dto.user.UserLoginDto;
import project.data_exchange_project.service.UserService;

import java.lang.invoke.MethodHandles;

@RestController
@RequestMapping(value = "/authentication")
public class LoginEndpoint {

    private static final Logger log = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private final UserService userService;

    public LoginEndpoint(UserService userService) {
        this.userService = userService;
    }

    @Operation(
            description = "Endpoint used for authentication",
            summary = "Returns JWT String if successful",
            responses = {
                    @ApiResponse(
                            description = "Success",
                            responseCode = "200"),
                    @ApiResponse(
                            description = "Unauthorized",
                            responseCode = "401"),
                    @ApiResponse(
                            description = "Forbidden",
                            responseCode = "403")
            }
    )
    @PermitAll
    @PutMapping()
    public String login(@RequestBody @Valid UserLoginDto userLoginDto) {
        log.info("PUT api/v1/authentication - {}", userLoginDto);
        try {
            return userService.loginUser(userLoginDto);
        } catch (BadCredentialsException | LockedException e) {
            HttpStatus status = e.getClass().getSimpleName().equals("BadCredentialsException") ? HttpStatus.UNAUTHORIZED : HttpStatus.FORBIDDEN;
            logClientError(status, e);
            throw new ResponseStatusException(status, e.getMessage(), e);
        }
    }

    @GetMapping()
    public String logout() {
        return "ok";
    }

    private void logClientError(HttpStatus status, Exception e) {
        log.warn("{} {}: {}: {}", status.value(), "Authentication error", e.getClass().getSimpleName(), e.getMessage());
    }
}
