package com.alleviare.user.controller;

import com.alleviare.common.dto.ApiResponse;
import com.alleviare.user.entity.User;
import com.alleviare.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers(@RequestParam(required = false) String role) {
        List<User> users = (role != null) ? userService.getUsersByRole(role) : userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(userService.getUserById(id)));
    }

    @GetMapping("/supervisor/{supervisorId}/team")
    public ResponseEntity<ApiResponse<List<User>>> getSupervisorTeam(@PathVariable UUID supervisorId) {
        return ResponseEntity.ok(ApiResponse.ok(userService.getFieldForceBySupervisor(supervisorId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<User>> createUser(@RequestBody User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(userService.createUser(user), "User created successfully"));
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<User>> toggleStatus(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(userService.toggleUserStatus(id), "User status updated"));
    }

    @PutMapping("/{id}/transfer")
    public ResponseEntity<ApiResponse<User>> transferMR(
            @PathVariable UUID id,
            @RequestParam UUID managerId,
            @RequestParam UUID territoryId) {
        return ResponseEntity.ok(ApiResponse.ok(
                userService.transferMR(id, managerId, territoryId),
                "MR transferred successfully"
        ));
    }
}
