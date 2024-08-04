package project.data_exchange_project.rest.dto.user;

public record UserInformationDto(
        String firstName,
        String lastName,
        String email,
        boolean isBlocked,
        boolean isPending,
        boolean isAdmin
) {
}
