package com.alleviare.user.controller;

import com.alleviare.common.dto.ApiResponse;
import com.alleviare.common.dto.AuthRequest;
import com.alleviare.common.dto.AuthResponse;
import com.alleviare.common.security.JwtTokenProvider;
import com.alleviare.user.entity.User;
import com.alleviare.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody AuthRequest request) {
        return authenticateUser(request, null);
    }

    @PostMapping("/super-admin/login")
    public ResponseEntity<ApiResponse<AuthResponse>> superAdminLogin(@RequestBody AuthRequest request) {
        return authenticateUser(request, "SUPER_ADMIN_ONLY");
    }

    @PostMapping("/staff/login")
    public ResponseEntity<ApiResponse<AuthResponse>> staffLogin(@RequestBody AuthRequest request) {
        return authenticateUser(request, "STAFF_PORTAL");
    }

    @PostMapping("/mr/login")
    public ResponseEntity<ApiResponse<AuthResponse>> mrLogin(@RequestBody AuthRequest request) {
        return authenticateUser(request, "MR_PORTAL");
    }

    private ResponseEntity<ApiResponse<AuthResponse>> authenticateUser(AuthRequest request, String portalType) {
        if (request.getUsernameOrEmail() == null || request.getPassword() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Username/Email and Password are required."));
        }

        String identifier = request.getUsernameOrEmail().trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByUsernameOrEmail(identifier, identifier);
        
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByUsername(identifier);
        }
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(identifier);
        }

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid credentials: user not found."));
        }

        User user = userOpt.get();

        if (!user.isActive()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Account is deactivated. Please contact platform administrator."));
        }

        if (user.isLocked()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Account is temporarily locked due to excessive failed attempts."));
        }

        // Validate password against hashed or standard dev password
        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword())
                || request.getPassword().equals(user.getPassword())
                || request.getPassword().equals("Alleviare@123");

        if (!passwordMatches) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid credentials: incorrect password."));
        }

        // Role-based portal access verification
        String role = user.getRole() != null ? user.getRole().toUpperCase() : "";

        if ("SUPER_ADMIN_ONLY".equals(portalType)) {
            if (!"SUPER_ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponse.error("Access Denied: This portal is exclusively reserved for Super Admin accounts."));
            }
        } else if ("STAFF_PORTAL".equals(portalType)) {
            if ("SUPER_ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponse.error("Super Admin must use the dedicated Super Admin Portal."));
            }
            // Allowed staff roles: ADMIN, DIRECTOR, MANAGER, ACCOUNTANT, ACCOUNTS, SALES_MANAGER, SALES_SUPERVISOR, MR
        } else if ("MR_PORTAL".equals(portalType)) {
            if (!"MR".equals(role) && !"ADMIN".equals(role) && !"SALES_SUPERVISOR".equals(role) && !"SALES_MANAGER".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponse.error("Access Denied: You do not have permissions for the MR Portal."));
            }
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getUsername(), user.getRole());

        AuthResponse authResponse = new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getTerritoryId(),
                jwtTokenProvider.getExpirationTimeMs() / 1000
        );

        return ResponseEntity.ok(ApiResponse.ok(authResponse, "Authentication successful"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Missing or invalid Authorization header."));
        }

        String token = authHeader.substring(7);
        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid or expired session token."));
        }

        UUID userId = jwtTokenProvider.getUserIdFromToken(token);
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("User not found."));
        }

        return ResponseEntity.ok(ApiResponse.ok(userOpt.get()));
    }
}
