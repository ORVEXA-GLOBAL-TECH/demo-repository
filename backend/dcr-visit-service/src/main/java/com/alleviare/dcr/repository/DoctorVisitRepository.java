package com.alleviare.dcr.repository;

import com.alleviare.dcr.entity.DoctorVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DoctorVisitRepository extends JpaRepository<DoctorVisit, UUID> {
    List<DoctorVisit> findByMrId(UUID mrId);
    List<DoctorVisit> findByDoctorId(UUID doctorId);
}
