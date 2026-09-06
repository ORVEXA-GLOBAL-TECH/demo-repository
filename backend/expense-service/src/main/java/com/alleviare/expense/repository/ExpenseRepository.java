package com.alleviare.expense.repository;

import com.alleviare.expense.entity.ExpenseClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExpenseRepository extends JpaRepository<ExpenseClaim, UUID> {
    List<ExpenseClaim> findByEmployeeId(UUID employeeId);
    List<ExpenseClaim> findByStatus(String status);
}
