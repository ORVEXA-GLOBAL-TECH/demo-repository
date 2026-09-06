package com.alleviare.dcr.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class GeofenceAlert {
    private String alertId;
    private UUID mrId;
    private String mrName;
    private String doctorId;
    private String doctorName;
    private Double distanceMeters;
    private String event; // ENTERED_150M_GEOFENCE, EXITED_150M_GEOFENCE, CHECKIN_VERIFIED
    private LocalDateTime timestamp = LocalDateTime.now();

    public GeofenceAlert() {}

    public GeofenceAlert(String alertId, UUID mrId, String mrName, String doctorId, String doctorName, Double distanceMeters, String event) {
        this.alertId = alertId;
        this.mrId = mrId;
        this.mrName = mrName;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.distanceMeters = distanceMeters;
        this.event = event;
        this.timestamp = LocalDateTime.now();
    }

    public String getAlertId() { return alertId; }
    public void setAlertId(String alertId) { this.alertId = alertId; }

    public UUID getMrId() { return mrId; }
    public void setMrId(UUID mrId) { this.mrId = mrId; }

    public String getMrName() { return mrName; }
    public void setMrName(String mrName) { this.mrName = mrName; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public Double getDistanceMeters() { return distanceMeters; }
    public void setDistanceMeters(Double distanceMeters) { this.distanceMeters = distanceMeters; }

    public String getEvent() { return event; }
    public void setEvent(String event) { this.event = event; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
