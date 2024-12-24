package project.dataexchangeproject.rest.dto;

import java.util.List;
import java.util.Map;

public record SparqlResult(
        Head head,
        Results results
) {
  public record Head(
          List<String> vars
  ) {
  }

  public record Results(
          List<Binding> bindings
  ) {
  }

  public record Binding(
          Map<String, Value> values
  ) {
  }

  public record Value(
          String type,
          String value
  ) {
  }

}
