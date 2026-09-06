package com.alleviare.dcr.controller;

import com.alleviare.common.dto.ApiResponse;
import com.alleviare.dcr.entity.DoctorVisit;
import com.alleviare.dcr.repository.DoctorVisitRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/visits")
public class VisitController {

    private final DoctorVisitRepository visitRepository;

    public VisitController(DoctorVisitRepository visitRepository) {
        this.visitRepository = visitRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorVisit>>> getVisitsByMr(@RequestParam UUID mrId) {
        return ResponseEntity.ok(ApiResponse.ok(visitRepository.findByMrId(mrId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DoctorVisit>> recordVisit(@RequestBody DoctorVisit visit) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(visitRepository.save(visit), "Doctor Visit recorded successfully"));
    }
}
