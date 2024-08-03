package project.data_exchange_project.service;

import org.springframework.security.authentication.BadCredentialsException;
import project.data_exchange_project.rest.dto.user.UserLoginDto;

public interface UserService {


    String loginUser(UserLoginDto userLoginDto) throws BadCredentialsException;
}
