package project.data_exchange_project.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project.data_exchange_project.rest.dto.user.UserInformationDto;
import project.data_exchange_project.rest.dto.user.UserSearchDto;
import project.data_exchange_project.service.UserService;

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
}
