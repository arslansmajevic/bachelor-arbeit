package project.dataexchangeproject.rest.dto.user;

public record UserSearchDto(
    String firstName,
    String lastName,
    String email,
    Boolean isBlocked,
    Boolean isPending,
    Boolean isAdmin,
    Integer pageIndex,
    Integer pageSize
) {
}
