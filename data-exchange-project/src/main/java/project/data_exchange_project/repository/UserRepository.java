package project.data_exchange_project.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query("SELECT u FROM ApplicationUser u WHERE "
            + "(:firstName IS NULL OR UPPER(u.firstName) LIKE CONCAT('%', UPPER(:firstName), '%')) "
            + "AND (:lastName IS NULL OR UPPER(u.lastName) LIKE CONCAT('%', UPPER(:lastName), '%')) "
            + "AND (:email IS NULL OR UPPER(u.email) LIKE CONCAT('%', UPPER(:email), '%')) "
            + "AND (:isAdmin IS NULL OR :isAdmin = u.isAdmin) "
            + "AND (:isBlocked IS NULL OR :isBlocked = u.isLocked) "
            + "AND (:isPending IS NULL OR :isPending = u.isPending) "
    )
    Page<ApplicationUser> findBySearch(@Param("firstName") String firstName,
                                       @Param("lastName") String lastName,
                                       @Param("email") String email,
                                       @Param("isAdmin") Boolean isAdmin,
                                       @Param("isBlocked") Boolean isBlocked,
                                       @Param("isPending") Boolean isPending,
                                       Pageable pageable);
}
