package project.dataexchangeproject.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.constraints.Email;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.dataexchangeproject.rest.dto.configs.GraphDatabaseConfigDto;
import project.dataexchangeproject.rest.dto.user.UserInformationDto;
import project.dataexchangeproject.rest.dto.user.UserSearchDto;
import project.dataexchangeproject.service.UserService;

import java.lang.invoke.MethodHandles;

@RestController
@RequestMapping(value = "/admin")
public class AdminEndpoint {

  private static final Logger log = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

  private final UserService userService;

  public AdminEndpoint(UserService userService) {
    this.userService = userService;
  }

  @Operation(
          description = "Endpoint for searching users. If no parameters are given, every users is returned.",
          summary = "Returns a pageable of users",
          responses = {
              @ApiResponse(
                      description = "Success",
                      responseCode = "200"
              ),
              @ApiResponse(
                      description = "Unauthorized",
                      responseCode = "403"
              )
          }
  )
  @Secured("ROLE_ADMIN")
  @GetMapping("search")
  public Page<UserInformationDto> searchUsers(UserSearchDto userSearchDto) {
    log.info("GET /api/v1/users/search {}", userSearchDto);
    return userService.searchUsers(userSearchDto);
  }

  @Secured("ROLE_ADMIN")
  @PutMapping("grant-permission/{email}")
  public UserInformationDto grantPermissionToUser(@PathVariable("email") @Email String email) {
    log.info("PUT /api/v1/admin/grant-permission/{}", email);
    return userService.grantPermissionToUser(email);
  }

  @Secured("ROLE_ADMIN")
  @GetMapping("database")
  public GraphDatabaseConfigDto getDatabaseConfig() {
    log.info("GET /api/v1/admin/database");
    return userService.getDatabaseConfig();
  }

  @Secured("ROLE_ADMIN")
  @PutMapping("database")
  public GraphDatabaseConfigDto updateDatabaseConfig(@RequestBody GraphDatabaseConfigDto graphDatabaseConfigDto) {
    log.info("PUT /api/v1/admin/database/{}", graphDatabaseConfigDto);
    return userService.updateDatabaseConfig(graphDatabaseConfigDto);
  }
}
