package com.alleviare.catalog.controller;

import com.alleviare.catalog.entity.Doctor;
import com.alleviare.catalog.repository.DoctorRepository;
import com.alleviare.common.dto.ApiResponse;
import com.alleviare.common.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/doctors")
public class DoctorController {

    private final DoctorRepository doctorRepository;

    public DoctorController(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Doctor>>> getAllDoctors(@RequestParam(required = false) UUID mrId) {
        List<Doctor> list = (mrId != null) ? doctorRepository.findByAssignedMrId(mrId) : doctorRepository.findAll();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Doctor>> getDoctorById(@PathVariable UUID id) {
        Doctor doc = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", id));
        return ResponseEntity.ok(ApiResponse.ok(doc));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Doctor>> registerDoctor(@RequestBody Doctor doctor) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(doctorRepository.save(doctor), "Doctor registered successfully"));
    }

    @PatchMapping("/{id}/verify")
    public ResponseEntity<ApiResponse<Doctor>> verifyDoctor(@PathVariable UUID id) {
        Doctor doc = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", id));
        doc.setVerified(true);
        return ResponseEntity.ok(ApiResponse.ok(doctorRepository.save(doc), "Doctor verified"));
    }
}
