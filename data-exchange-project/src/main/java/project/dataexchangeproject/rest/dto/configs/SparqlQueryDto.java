package project.dataexchangeproject.rest.dto.configs;

public record SparqlQueryDto(
        Long id,
        String name,
        String description,
        String query
) {
}
