package com.alleviare.user.entity;

import com.alleviare.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String role; // SUPER_ADMIN, ADMIN, DIRECTOR, MANAGER, SALES_MANAGER, SALES_SUPERVISOR, ACCOUNTS, MR

    @Column(name = "reporting_manager_id")
    private UUID reportingManagerId;

    @Column(name = "territory_id")
    private UUID territoryId;

    @Column(name = "department")
    private String department;

    @Column(name = "designation")
    private String designation;

    @Column(name = "device_id")
    private String deviceId;

    @Column(name = "is_active")
    private boolean active = true;

    @Column(name = "is_locked")
    private boolean locked = false;

    public User() {}

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public UUID getReportingManagerId() { return reportingManagerId; }
    public void setReportingManagerId(UUID reportingManagerId) { this.reportingManagerId = reportingManagerId; }

    public UUID getTerritoryId() { return territoryId; }
    public void setTerritoryId(UUID territoryId) { this.territoryId = territoryId; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public boolean isLocked() { return locked; }
    public void setLocked(boolean locked) { this.locked = locked; }
}
