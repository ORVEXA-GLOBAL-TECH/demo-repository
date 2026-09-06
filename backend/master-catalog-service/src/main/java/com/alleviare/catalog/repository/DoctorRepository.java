package com.alleviare.catalog.repository;

import com.alleviare.catalog.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, UUID> {
    List<Doctor> findByAssignedMrId(UUID mrId);
    List<Doctor> findByTerritoryId(UUID territoryId);
    List<Doctor> findByCategory(String category);

    // PostGIS 150m Geofencing Query
    @Query(value = """
        SELECT d.*, 
               ST_DistanceSphere(d.location, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)) as distance
        FROM doctors d
        WHERE d.id = :doctorId
          AND ST_DWithin(d.location, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326), :radiusMeters)
    """, nativeQuery = true)
    Optional<Doctor> verifyClinicGeofence(
            @Param("doctorId") UUID doctorId,
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("radiusMeters") double radiusMeters
    );
}
