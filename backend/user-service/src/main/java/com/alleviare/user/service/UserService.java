package com.alleviare.user.service;

import com.alleviare.common.exception.ResourceNotFoundException;
import com.alleviare.user.entity.User;
import com.alleviare.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }

    public List<User> getFieldForceBySupervisor(UUID supervisorId) {
        return userRepository.findByReportingManagerId(supervisorId);
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role.toUpperCase());
    }

    @Transactional
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public User toggleUserStatus(UUID id) {
        User user = getUserById(id);
        user.setActive(!user.isActive());
        return userRepository.save(user);
    }

    @Transactional
    public User transferMR(UUID mrId, UUID newManagerId, UUID newTerritoryId) {
        User mr = getUserById(mrId);
        mr.setReportingManagerId(newManagerId);
        mr.setTerritoryId(newTerritoryId);
        return userRepository.save(mr);
    }
}
