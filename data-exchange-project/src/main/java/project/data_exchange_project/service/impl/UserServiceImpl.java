package project.data_exchange_project.service.impl;

import jakarta.validation.ValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import project.data_exchange_project.config.database.GraphDBConfig;
import project.data_exchange_project.entity.ApplicationUser;
import project.data_exchange_project.mapper.UserMapper;
import project.data_exchange_project.repository.GraphDBConfigRepository;
import project.data_exchange_project.repository.GraphDbRepository;
import project.data_exchange_project.repository.UserRepository;
import project.data_exchange_project.rest.dto.configs.GraphDatabaseConfigDto;
import project.data_exchange_project.rest.dto.user.UserInformationDto;
import project.data_exchange_project.rest.dto.user.UserLoginDto;
import project.data_exchange_project.rest.dto.user.UserSearchDto;
import project.data_exchange_project.security.JwtTokenizer;
import project.data_exchange_project.security.UserAuthentication;
import project.data_exchange_project.service.UserService;

import java.lang.invoke.MethodHandles;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private static final Logger log = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenizer jwtTokenizer;
    private final UserMapper userMapper;
    private final UserAuthentication userAuthentication;
    private final GraphDBConfigRepository graphDBConfigRepository;
    private final GraphDBConfig graphDBConfig;
    private final GraphDbRepository graphDbRepository;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenizer jwtTokenizer, UserMapper userMapper, UserAuthentication userAuthentication, GraphDBConfigRepository graphDBConfigRepository, GraphDBConfig graphDBConfig, GraphDbRepository graphDbRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenizer = jwtTokenizer;
        this.userMapper = userMapper;
        this.userAuthentication = userAuthentication;
        this.graphDBConfigRepository = graphDBConfigRepository;
        this.graphDBConfig = graphDBConfig;
        this.graphDbRepository = graphDbRepository;
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

    @Override
    public Page<UserInformationDto> searchUsers(UserSearchDto userSearchDto) {
        log.info("searchingUsers {}", userSearchDto);

        userAuthentication.checkBlockedStatus(userAuthentication.getEmail());

        int pageIndex, pageSize;
        if (userSearchDto.pageIndex() == null) {
            pageIndex = 0;
        } else {
            pageIndex = userSearchDto.pageIndex();
        }

        if (userSearchDto.pageSize() == null) {
            pageSize = 10;
        } else {
            pageSize = userSearchDto.pageSize();
        }

        Pageable pageable = PageRequest.of(pageIndex, pageSize);

        Page<ApplicationUser> users = userRepository.findBySearch(
                userSearchDto.firstName(),
                userSearchDto.lastName(),
                userSearchDto.email(),
                userSearchDto.isAdmin(),
                userSearchDto.isBlocked(),
                userSearchDto.isPending(),
                pageable
        );

        List<UserInformationDto> usersInformationDto = users.stream()
                .map(userMapper::userToInformationDto)
                .toList();

        return new PageImpl<>(usersInformationDto, pageable, users.getTotalElements());
    }

    @Override
    public UserInformationDto grantPermissionToUser(String email) {
        log.info("grantingPermissionToUser[{}]", email);

        return null;
    }

    @Override
    public GraphDatabaseConfigDto getDatabaseConfig() {
        var config = graphDBConfigRepository.getDevGraphDBConfiguration();

        return new GraphDatabaseConfigDto(
                config.getGraphDbServerUrl(),
                config.getRepositoryId(),
                config.getPort(),
                config.getGeneratedUrl()
        );
    }

    @Override
    public GraphDatabaseConfigDto updateDatabaseConfig(GraphDatabaseConfigDto graphDatabaseConfigDto) {

        graphDBConfigRepository.updateDatabaseConfig(
                graphDatabaseConfigDto.graphDbServerUrl(),
                graphDatabaseConfigDto.repositoryId(),
                graphDatabaseConfigDto.port(),
                String.format("%s:%d/repositories/%s",
                        graphDatabaseConfigDto.graphDbServerUrl(),
                        graphDatabaseConfigDto.port(),
                        graphDatabaseConfigDto.repositoryId())
        );

        /*graphDBConfig.updateRepository(
                graphDatabaseConfigDto.graphDbServerUrl(),
                graphDatabaseConfigDto.repositoryId(),
                graphDatabaseConfigDto.port().intValue()
        );*/

        updateDatabaseConfig(graphDatabaseConfigDto.generatedUrl());

        return graphDatabaseConfigDto;
    }

    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.trace("loadByUsername[{}]", email);

        ApplicationUser user = userRepository.findUserByEmail(email);

        if (user == null) {
            throw new UsernameNotFoundException(email);
        }

        if (user.isPending()) {
            throw new BadCredentialsException("This account is pending for permission!");
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

    private void updateDatabaseConfig(String endpointUrl) {
        graphDbRepository.updateDatabaseEndpoint(endpointUrl);
    }
}
