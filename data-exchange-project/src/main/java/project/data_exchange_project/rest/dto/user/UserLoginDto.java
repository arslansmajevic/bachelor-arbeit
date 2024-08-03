package project.data_exchange_project.rest.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserLoginDto(

        @NotNull(message = "Email field can't be null")
        @Email(message = "Email must be valid")
        @NotEmpty(message = "Email field can't be empty")
        @NotBlank(message = "Email field can't be empty")
        @Size(message = "Email must be less than 100 characters long", max = 100)
        String email,
        @NotNull(message = "Password field can't be null")
        @NotEmpty(message = "Password field can't be empty")
        @NotBlank(message = "Password field can't be empty")
        String password
) {
}
