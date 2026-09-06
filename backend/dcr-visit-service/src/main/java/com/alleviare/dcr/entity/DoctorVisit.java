package com.alleviare.dcr.entity;

import com.alleviare.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "doctor_visits")
public class DoctorVisit extends BaseEntity {

    @Column(name = "mr_id", nullable = false)
    private UUID mrId;

    @Column(name = "doctor_id", nullable = false)
    private UUID doctorId;

    @Column(name = "visit_timestamp", nullable = false)
    private LocalDateTime visitTimestamp = LocalDateTime.now();

    @Column(columnDefinition = "geometry(Point,4326)")
    private Point checkinLocation;

    @Column(columnDefinition = "geometry(Point,4326)")
    private Point checkoutLocation;

    @Column(name = "is_geofence_verified")
    private boolean geofenceVerified = false;

    private Integer durationMinutes;

    @Column(columnDefinition = "TEXT")
    private String productsDiscussed;

    @Column(columnDefinition = "TEXT")
    private String samplesGiven;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private LocalDateTime nextFollowupDate;

    @Column(nullable = false)
    private String status = "COMPLETED"; // PLANNED, IN_PROGRESS, COMPLETED, MISSED, RESCHEDULED

    public DoctorVisit() {}

    public UUID getMrId() { return mrId; }
    public void setMrId(UUID mrId) { this.mrId = mrId; }

    public UUID getDoctorId() { return doctorId; }
    public void setDoctorId(UUID doctorId) { this.doctorId = doctorId; }

    public LocalDateTime getVisitTimestamp() { return visitTimestamp; }
    public void setVisitTimestamp(LocalDateTime visitTimestamp) { this.visitTimestamp = visitTimestamp; }

    public Point getCheckinLocation() { return checkinLocation; }
    public void setCheckinLocation(Point checkinLocation) { this.checkinLocation = checkinLocation; }

    public Point getCheckoutLocation() { return checkoutLocation; }
    public void setCheckoutLocation(Point checkoutLocation) { this.checkoutLocation = checkoutLocation; }

    public boolean isGeofenceVerified() { return geofenceVerified; }
    public void setGeofenceVerified(boolean geofenceVerified) { this.geofenceVerified = geofenceVerified; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getProductsDiscussed() { return productsDiscussed; }
    public void setProductsDiscussed(String productsDiscussed) { this.productsDiscussed = productsDiscussed; }

    public String getSamplesGiven() { return samplesGiven; }
    public void setSamplesGiven(String samplesGiven) { this.samplesGiven = samplesGiven; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public LocalDateTime getNextFollowupDate() { return nextFollowupDate; }
    public void setNextFollowupDate(LocalDateTime nextFollowupDate) { this.nextFollowupDate = nextFollowupDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
