package com.alleviare.common;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(ApiException.class)
    ResponseEntity<Map<String, Object>> api(ApiException e) {
        return ResponseEntity.status(e.status()).body(Map.of("success", false, "code", e.code(), "message", e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<Map<String, Object>> invalid(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().stream()
            .map(f -> f.getField() + " " + f.getDefaultMessage()).findFirst().orElse("Invalid request");
        return ResponseEntity.badRequest().body(Map.of("success", false, "code", "VALIDATION", "message", msg));
    }

    @ExceptionHandler(AccessDeniedException.class)
    ResponseEntity<Map<String, Object>> denied(AccessDeniedException e) {
        return ResponseEntity.status(403).body(Map.of("success", false, "code", "FORBIDDEN",
            "message", "Your role is not permitted to perform this action."));
    }
}
