package com.alleviare.adminservice.service;

import com.alleviare.adminservice.dto.UserCreateRequest;
import com.alleviare.adminservice.dto.UserDto;
import com.alleviare.adminservice.model.Role;
import com.alleviare.adminservice.model.User;
import com.alleviare.adminservice.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void initializeDefaultUsers() {
        if (userRepository.count() == 0) {
            userRepository.save(new User("admin@alleviare.com", "Alice Admin", passwordEncoder.encode("Admin123!"), Role.ADMIN));
            userRepository.save(new User("manager@alleviare.com", "Mohan Manager", passwordEncoder.encode("Manager123!"), Role.MANAGER));
            userRepository.save(new User("accountant@alleviare.com", "Priya Accountant", passwordEncoder.encode("Accountant123!"), Role.ACCOUNTANT));
        }
    }

    public List<UserDto> findUsers(String role) {
        if (role == null || role.equalsIgnoreCase("all")) {
            return userRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
        }
        Role parsedRole = Role.valueOf(role.toUpperCase());
        return userRepository.findByRole(parsedRole).stream().map(this::toDto).collect(Collectors.toList());
    }

    public Optional<UserDto> findById(Long id) {
        return userRepository.findById(id).map(this::toDto);
    }

    public UserDto createUser(UserCreateRequest request) {
        User user = new User(
                request.getEmail(),
                request.getName(),
                passwordEncoder.encode(request.getPassword()),
                Role.valueOf(request.getRole().toUpperCase())
        );
        return toDto(userRepository.save(user));
    }

    public Optional<UserDto> updateUser(Long id, UserCreateRequest request) {
        return userRepository.findById(id).map(user -> {
            user.setEmail(request.getEmail());
            user.setName(request.getName());
            user.setRole(Role.valueOf(request.getRole().toUpperCase()));
            if (request.getPassword() != null && !request.getPassword().isBlank()) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            }
            return toDto(userRepository.save(user));
        });
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    private UserDto toDto(User user) {
        return new UserDto(user.getId(), user.getEmail(), user.getName(), user.getRole());
    }
}
