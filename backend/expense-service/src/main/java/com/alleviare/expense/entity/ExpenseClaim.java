package com.alleviare.expense.entity;

import com.alleviare.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "expenses")
public class ExpenseClaim extends BaseEntity {

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(nullable = false)
    private String category; // Fuel & Travel, Food & DA, Accommodation, Miscellaneous

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDate expenseDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer kmDriven;
    private String receiptUrl;
    private boolean ocrVerified = false;

    @Column(nullable = false)
    private String status = "SUBMITTED"; // SUBMITTED, SUPERVISOR_APPROVED, ACCOUNTS_APPROVED, REIMBURSED, REJECTED

    public ExpenseClaim() {}

    public UUID getEmployeeId() { return employeeId; }
    public void setEmployeeId(UUID employeeId) { this.employeeId = employeeId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LocalDate getExpenseDate() { return expenseDate; }
    public void setExpenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getKmDriven() { return kmDriven; }
    public void setKmDriven(Integer kmDriven) { this.kmDriven = kmDriven; }

    public String getReceiptUrl() { return receiptUrl; }
    public void setReceiptUrl(String receiptUrl) { this.receiptUrl = receiptUrl; }

    public boolean isOcrVerified() { return ocrVerified; }
    public void setOcrVerified(boolean ocrVerified) { this.ocrVerified = ocrVerified; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
