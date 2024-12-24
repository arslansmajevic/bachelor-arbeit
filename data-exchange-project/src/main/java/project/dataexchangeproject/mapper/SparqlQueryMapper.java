package project.dataexchangeproject.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import project.dataexchangeproject.entity.SparqlQuery;
import project.dataexchangeproject.rest.dto.configs.SparqlQueryDto;

@Mapper(componentModel = "spring")
public interface SparqlQueryMapper {

  @Mapping(target = "id", source = "id")
  @Mapping(target = "name", source = "name")
  @Mapping(target = "description", source = "description")
  @Mapping(target = "query", source = "query")
  SparqlQueryDto sparqlQueryToDto(SparqlQuery sparqlQuery);
}
