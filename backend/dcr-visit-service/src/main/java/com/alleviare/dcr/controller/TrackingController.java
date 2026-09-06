package com.alleviare.dcr.controller;

import com.alleviare.common.dto.ApiResponse;
import com.alleviare.dcr.dto.GeofenceAlert;
import com.alleviare.dcr.dto.LocationPing;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
public class TrackingController {

    private final SimpMessagingTemplate messagingTemplate;
    private final Map<UUID, LocationPing> latestFleetLocations = new ConcurrentHashMap<>();

    // Sample Doctor Clinic Geofence Points for Distance Check
    private static final Map<String, double[]> DOCTOR_CLINICS = Map.of(
            "Dr. A. Mehta (KEM Hospital)", new double[]{18.9820, 72.8340},
            "Dr. Sanjay Deshmukh (Saifee Hospital)", new double[]{18.9520, 72.8180},
            "Dr. R. K. Joshi (Apollo Vashi)", new double[]{19.0760, 73.0010}
    );

    public TrackingController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * 1. STOMP WebSocket Message Receiver from Field MR Apps
     */
    @MessageMapping("/mr/location-ping")
    @SendTo("/topic/mr-locations")
    public LocationPing handleWebSocketLocationPing(LocationPing ping) {
        processPingAndCheckGeofence(ping);
        return ping;
    }

    /**
     * 2. REST Endpoint for HTTP location beacons / fallback
     */
    @PostMapping("/api/v1/visits/location-ping")
    public ResponseEntity<ApiResponse<LocationPing>> handleRestLocationPing(@RequestBody LocationPing ping) {
        processPingAndCheckGeofence(ping);
        // Broadcast over WebSocket to all connected Supervisors & Directors
        messagingTemplate.convertAndSend("/topic/mr-locations", ping);
        return ResponseEntity.ok(ApiResponse.ok(ping, "Location ping processed"));
    }

    /**
     * 3. Snapshot of all live active fleet positions
     */
    @GetMapping("/api/v1/visits/active-fleet")
    public ResponseEntity<ApiResponse<List<LocationPing>>> getActiveFleet() {
        return ResponseEntity.ok(ApiResponse.ok(new ArrayList<>(latestFleetLocations.values())));
    }

    private void processPingAndCheckGeofence(LocationPing ping) {
        if (ping.getTimestamp() == null) {
            ping.setTimestamp(LocalDateTime.now());
        }
        if (ping.getMrId() != null) {
            latestFleetLocations.put(ping.getMrId(), ping);
        }

        if (ping.getLatitude() != null && ping.getLongitude() != null) {
            for (Map.Entry<String, double[]> clinic : DOCTOR_CLINICS.entrySet()) {
                double distanceMeters = calculateHaversineDistance(
                        ping.getLatitude(), ping.getLongitude(),
                        clinic.getValue()[0], clinic.getValue()[1]
                );

                if (distanceMeters <= 150.0) {
                    ping.setIsInsideGeofence(true);
                    ping.setCurrentDoctorName(clinic.getKey());

                    GeofenceAlert alert = new GeofenceAlert(
                            "GEO-" + System.currentTimeMillis(),
                            ping.getMrId(),
                            ping.getMrName() != null ? ping.getMrName() : "Rahul Verma (MR)",
                            clinic.getKey(),
                            clinic.getKey(),
                            Math.round(distanceMeters * 10.0) / 10.0,
                            "ENTERED_150M_GEOFENCE"
                    );

                    // Broadcast instant Geofence audit event
                    messagingTemplate.convertAndSend("/topic/geofence-alerts", alert);
                    break;
                }
            }
        }
    }

    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS_METERS = 6371000;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_METERS * c;
    }
}
