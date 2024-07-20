package project.data_exchange_project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import project.data_exchange_project.entity.ApplicationUser;

@Repository
public interface UserRepository extends JpaRepository<ApplicationUser, Long> {

    @Query("SELECT u FROM ApplicationUser u WHERE u.email = :email")
    ApplicationUser findUserByEmail(@Param("email") String email);


    @Transactional
    @Modifying
    @Query("UPDATE ApplicationUser u SET u.loginAttempts = :loginAttempts WHERE u.email = :email")
    void setLoginAttempts(@Param("email") String email, @Param("loginAttempts") int loginAttempts);

    @Transactional
    @Modifying
    @Query("UPDATE ApplicationUser u SET u.isLocked = :isLocked WHERE u.email = :email")
    void updateIsLocked(@Param("email") String email, @Param("isLocked") Boolean isLocked);

}
