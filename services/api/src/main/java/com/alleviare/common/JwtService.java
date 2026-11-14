package com.alleviare.common;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private final SecretKey key;
    private final Duration ttl;
    private final PermissionService permissions;

    public JwtService(AppProperties props, PermissionService permissions) {
        this.permissions = permissions;
        String secret = props.jwt().secret();
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException("app.jwt.secret (JWT_SECRET) must be set to at least 32 bytes");
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.ttl = Duration.ofMinutes(props.jwt().ttlMinutes());
    }

    public String issue(Principal p) {
        Instant now = Instant.now();
        var builder = Jwts.builder()
            .subject(p.userId().toString())
            .claim("email", p.email())
            .claim("name", p.name())
            .claim("role", p.role())
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plus(ttl)));
        if (p.companyId() != null) builder.claim("tid", p.companyId().toString());
        return builder.signWith(key).compact();
    }

    public Optional<Principal> parse(String token) {
        try {
            Claims c = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
            String role = c.get("role", String.class);
            String tid = c.get("tid", String.class);
            return Optional.of(new Principal(UUID.fromString(c.getSubject()), c.get("email", String.class),
                c.get("name", String.class), role, tid == null ? null : UUID.fromString(tid),
                permissions.forRole(role)));
        } catch (JwtException | IllegalArgumentException e) {
            return Optional.empty();
        }
    }
}
