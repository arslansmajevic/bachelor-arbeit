package project.dataexchangeproject.rest.dto.configs;

public record GraphDatabaseConfigDto(
        String graphDbServerUrl,
        String repositoryId,
        Long port,
        String generatedUrl
) {

}
