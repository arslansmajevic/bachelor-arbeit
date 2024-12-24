package project.dataexchangeproject.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import project.dataexchangeproject.entity.ApplicationUser;
import project.dataexchangeproject.rest.dto.user.UserInformationDto;

@Mapper(componentModel = "spring")
public interface UserMapper {

  @Mapping(target = "isAdmin", source = "admin")
  @Mapping(target = "isBlocked", source = "locked")
  @Mapping(target = "isPending", source = "pending")
  UserInformationDto userToInformationDto(ApplicationUser user);
}
