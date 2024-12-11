package project.data_exchange_project.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import project.data_exchange_project.entity.SparqlQuery;
import project.data_exchange_project.rest.dto.configs.SparqlQueryDto;

@Mapper(componentModel = "spring")
public interface SparqlQueryMapper {

  @Mapping(target = "id", source = "id")
  @Mapping(target = "name", source = "name")
  @Mapping(target = "description", source = "description")
  @Mapping(target = "query", source = "query")
  SparqlQueryDto sparqlQueryToDto(SparqlQuery sparqlQuery);
}
