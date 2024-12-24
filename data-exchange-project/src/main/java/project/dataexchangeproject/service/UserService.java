package project.dataexchangeproject.service;

import org.springframework.data.domain.Page;
import org.springframework.security.authentication.BadCredentialsException;
import project.dataexchangeproject.rest.dto.configs.GraphDatabaseConfigDto;
import project.dataexchangeproject.rest.dto.configs.SparqlQueryDto;
import project.dataexchangeproject.rest.dto.user.UserInformationDto;
import project.dataexchangeproject.rest.dto.user.UserLoginDto;
import project.dataexchangeproject.rest.dto.user.UserSearchDto;

import java.util.List;

public interface UserService {


  String loginUser(UserLoginDto userLoginDto) throws BadCredentialsException;

  Page<UserInformationDto> searchUsers(UserSearchDto userSearchDto);

  UserInformationDto grantPermissionToUser(String email);

  GraphDatabaseConfigDto getDatabaseConfig();

  GraphDatabaseConfigDto updateDatabaseConfig(GraphDatabaseConfigDto graphDatabaseConfigDto);

  List<SparqlQueryDto> getSparqlQueries(Long id);

  SparqlQueryDto updateSparqlQuery(SparqlQueryDto sparqlQueryDto);
}
