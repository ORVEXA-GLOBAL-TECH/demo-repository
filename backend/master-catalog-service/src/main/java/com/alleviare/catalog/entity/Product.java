package com.alleviare.catalog.entity;

import com.alleviare.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(nullable = false)
    private String name;

    private String brand;
    private String genericName;

    @Column(columnDefinition = "TEXT")
    private String composition;

    private String category; // Cardiology, Diabetology, Pulmonology, Orthopedics
    private String packSize;

    @Column(nullable = false)
    private BigDecimal mrp;

    private BigDecimal ptr; // Price to Retailer
    private BigDecimal pts; // Price to Stockist

    private boolean available = true;

    public Product() {}

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getGenericName() { return genericName; }
    public void setGenericName(String genericName) { this.genericName = genericName; }

    public String getComposition() { return composition; }
    public void setComposition(String composition) { this.composition = composition; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPackSize() { return packSize; }
    public void setPackSize(String packSize) { this.packSize = packSize; }

    public BigDecimal getMrp() { return mrp; }
    public void setMrp(BigDecimal mrp) { this.mrp = mrp; }

    public BigDecimal getPtr() { return ptr; }
    public void setPtr(BigDecimal ptr) { this.ptr = ptr; }

    public BigDecimal getPts() { return pts; }
    public void setPts(BigDecimal pts) { this.pts = pts; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}
