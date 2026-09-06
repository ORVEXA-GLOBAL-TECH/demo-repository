package com.alleviare.dcr.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class LocationPing {
    private UUID mrId;
    private String mrName;
    private Double latitude;
    private Double longitude;
    private Double speed;
    private Integer batteryLevel;
    private Double accuracy;
    private String currentDoctorId;
    private String currentDoctorName;
    private Boolean isInsideGeofence;
    private LocalDateTime timestamp = LocalDateTime.now();

    public LocationPing() {}

    public UUID getMrId() { return mrId; }
    public void setMrId(UUID mrId) { this.mrId = mrId; }

    public String getMrName() { return mrName; }
    public void setMrName(String mrName) { this.mrName = mrName; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getSpeed() { return speed; }
    public void setSpeed(Double speed) { this.speed = speed; }

    public Integer getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(Integer batteryLevel) { this.batteryLevel = batteryLevel; }

    public Double getAccuracy() { return accuracy; }
    public void setAccuracy(Double accuracy) { this.accuracy = accuracy; }

    public String getCurrentDoctorId() { return currentDoctorId; }
    public void setCurrentDoctorId(String currentDoctorId) { this.currentDoctorId = currentDoctorId; }

    public String getCurrentDoctorName() { return currentDoctorName; }
    public void setCurrentDoctorName(String currentDoctorName) { this.currentDoctorName = currentDoctorName; }

    public Boolean getIsInsideGeofence() { return isInsideGeofence; }
    public void setIsInsideGeofence(Boolean insideGeofence) { isInsideGeofence = insideGeofence; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
