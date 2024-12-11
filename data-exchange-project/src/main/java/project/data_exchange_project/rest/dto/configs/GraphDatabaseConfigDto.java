package project.data_exchange_project.rest.dto.configs;

public record GraphDatabaseConfigDto(
        String graphDbServerUrl,
        String repositoryId,
        Long port,
        String generatedUrl
) {

}
