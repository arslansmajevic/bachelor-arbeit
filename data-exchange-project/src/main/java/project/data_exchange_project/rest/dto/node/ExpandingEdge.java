package project.data_exchange_project.rest.dto.node;

public record ExpandingEdge(
        String source,
        String target,
        String label
) { }
