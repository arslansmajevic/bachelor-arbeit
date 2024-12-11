package project.data_exchange_project.rest.dto.configs;

public record SparqlQueryDto(
        Long id,
        String name,
        String description,
        String query
) {
}
