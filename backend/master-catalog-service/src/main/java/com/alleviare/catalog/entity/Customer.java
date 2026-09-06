package com.alleviare.catalog.entity;

import com.alleviare.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "customers")
public class Customer extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // Retail Pharmacy, Stockist, Distributor, Hospital, Institution

    private String contactPerson;
    private String phone;
    private String email;
    private String address;

    @Column(name = "territory_id")
    private UUID territoryId;

    @Column(name = "assigned_mr_id")
    private UUID assignedMrId;

    private boolean active = true;

    public Customer() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public UUID getTerritoryId() { return territoryId; }
    public void setTerritoryId(UUID territoryId) { this.territoryId = territoryId; }

    public UUID getAssignedMrId() { return assignedMrId; }
    public void setAssignedMrId(UUID assignedMrId) { this.assignedMrId = assignedMrId; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
