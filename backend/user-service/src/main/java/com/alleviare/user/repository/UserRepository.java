package com.alleviare.user.repository;

import com.alleviare.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByUsernameOrEmail(String username, String email);
    List<User> findByRole(String role);
    List<User> findByReportingManagerId(UUID managerId);
    List<User> findByTerritoryId(UUID territoryId);
}
