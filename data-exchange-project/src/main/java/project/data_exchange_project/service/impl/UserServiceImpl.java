package project.data_exchange_project.service.impl;


import jakarta.validation.ValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import project.data_exchange_project.entity.ApplicationUser;
import project.data_exchange_project.repository.UserRepository;
import project.data_exchange_project.rest.dto.user.UserLoginDto;
import project.data_exchange_project.security.JwtTokenizer;
import project.data_exchange_project.service.UserService;

import java.lang.invoke.MethodHandles;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private static final Logger log = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenizer jwtTokenizer;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenizer jwtTokenizer) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenizer = jwtTokenizer;
    }

    @Override
    public String loginUser(UserLoginDto userLoginDto) throws BadCredentialsException{
        log.trace("loginUser{}", userLoginDto);
        UserDetails userDetails;
        try {
             userDetails = loadUserByUsername(userLoginDto.email());
        } catch (UsernameNotFoundException u) {
            throw new BadCredentialsException("Username or password is incorrect");
        }

        if (userDetails != null) {
            if (!userDetails.isAccountNonLocked()) {
                throw new LockedException("User account is locked");
            }

            if (userDetails.isAccountNonExpired()
                    && userDetails.isCredentialsNonExpired()
                    && passwordEncoder.matches(userLoginDto.password(), userDetails.getPassword())) {
                List<String> roles = userDetails.getAuthorities()
                        .stream()
                        .map(GrantedAuthority::getAuthority)
                        .toList();

                userRepository.setLoginAttempts(userLoginDto.email(), 0);
                return jwtTokenizer.getAuthToken(userDetails.getUsername(), roles);
            }
        } else {
            throw new BadCredentialsException("Username or password is incorrect");
        }

        return null;
    }

    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.trace("loadByUsername{}", email);

        ApplicationUser user = userRepository.findUserByEmail(email);

        if (user == null) {
            throw new UsernameNotFoundException(email);
        }

        List<GrantedAuthority> grantedAuthorities;

        if (user.isAdmin()) {
            grantedAuthorities = AuthorityUtils.createAuthorityList("ROLE_ADMIN", "ROLE_USER");
        } else {
            grantedAuthorities = AuthorityUtils.createAuthorityList("ROLE_USER");
        }

        if (user.getLoginAttempts() + 1 > 5 && !user.isAdmin()) {
            blockUser(email);
        } else {
            userRepository.setLoginAttempts(email, user.getLoginAttempts() + 1);
        }

        return new User(user.getEmail(), user.getPassword(), true, true, true, !user.isLocked(), grantedAuthorities);
    }

    public void blockUser(String email) throws ValidationException {
        log.trace("blockUser({})", email);
        userRepository.updateIsLocked(email, true);
        userRepository.setLoginAttempts(email, 5);
    }
}
