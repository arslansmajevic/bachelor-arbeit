package project.data_exchange_project.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import project.data_exchange_project.entity.ApplicationUser;
import project.data_exchange_project.rest.dto.user.UserInformationDto;

@Mapper(componentModel = "spring")
public interface UserMapper {

  @Mapping(target = "isAdmin", source = "admin")
  @Mapping(target = "isBlocked", source = "locked")
  @Mapping(target = "isPending", source = "pending")
  UserInformationDto userToInformationDto(ApplicationUser user);
}
