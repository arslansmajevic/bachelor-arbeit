package project.data_exchange_project.service;

import org.springframework.data.domain.Page;
import org.springframework.security.authentication.BadCredentialsException;
import project.data_exchange_project.rest.dto.user.UserInformationDto;
import project.data_exchange_project.rest.dto.user.UserLoginDto;
import project.data_exchange_project.rest.dto.user.UserSearchDto;

public interface UserService {


    String loginUser(UserLoginDto userLoginDto) throws BadCredentialsException;

    Page<UserInformationDto> searchUsers(UserSearchDto userSearchDto);
}
