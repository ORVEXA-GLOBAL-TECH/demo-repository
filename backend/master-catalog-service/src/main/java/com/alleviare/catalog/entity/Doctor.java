package com.alleviare.catalog.entity;

import com.alleviare.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.locationtech.jts.geom.Point;

import java.util.UUID;

@Entity
@Table(name = "doctors")
public class Doctor extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String specialization; // Cardiology, Diabetology, Pulmonology, Neurology

    private String qualification;
    private String hospitalClinic;
    private String phone;

    @Column(columnDefinition = "geometry(Point,4326)")
    private Point location; // PostGIS Geolocation coordinates

    private String category; // A+, A, B, C
    private String potential; // HIGH, MEDIUM, LOW
    private Integer visitFrequency = 2;

    @Column(name = "assigned_mr_id")
    private UUID assignedMrId;

    @Column(name = "territory_id")
    private UUID territoryId;

    private boolean verified = false;
    private boolean active = true;

    public Doctor() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public String getHospitalClinic() { return hospitalClinic; }
    public void setHospitalClinic(String hospitalClinic) { this.hospitalClinic = hospitalClinic; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Point getLocation() { return location; }
    public void setLocation(Point location) { this.location = location; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPotential() { return potential; }
    public void setPotential(String potential) { this.potential = potential; }

    public Integer getVisitFrequency() { return visitFrequency; }
    public void setVisitFrequency(Integer visitFrequency) { this.visitFrequency = visitFrequency; }

    public UUID getAssignedMrId() { return assignedMrId; }
    public void setAssignedMrId(UUID assignedMrId) { this.assignedMrId = assignedMrId; }

    public UUID getTerritoryId() { return territoryId; }
    public void setTerritoryId(UUID territoryId) { this.territoryId = territoryId; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
