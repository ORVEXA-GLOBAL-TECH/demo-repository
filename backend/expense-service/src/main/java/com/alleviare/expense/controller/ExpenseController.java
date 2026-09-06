package com.alleviare.expense.controller;

import com.alleviare.common.dto.ApiResponse;
import com.alleviare.common.exception.ResourceNotFoundException;
import com.alleviare.expense.entity.ExpenseClaim;
import com.alleviare.expense.repository.ExpenseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/expenses")
public class ExpenseController {

    private final ExpenseRepository expenseRepository;

    public ExpenseController(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExpenseClaim>>> getAllExpenses(
            @RequestParam(required = false) UUID employeeId,
            @RequestParam(required = false) String status) {
        List<ExpenseClaim> list;
        if (employeeId != null) {
            list = expenseRepository.findByEmployeeId(employeeId);
        } else if (status != null) {
            list = expenseRepository.findByStatus(status);
        } else {
            list = expenseRepository.findAll();
        }
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseClaim>> submitExpense(@RequestBody ExpenseClaim claim) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(expenseRepository.save(claim), "Expense submitted"));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<ExpenseClaim>> approveExpense(
            @PathVariable UUID id,
            @RequestParam String role) {
        ExpenseClaim claim = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", id));
        
        if ("SUPERVISOR".equalsIgnoreCase(role)) {
            claim.setStatus("SUPERVISOR_APPROVED");
        } else {
            claim.setStatus("ACCOUNTS_APPROVED");
        }
        return ResponseEntity.ok(ApiResponse.ok(expenseRepository.save(claim), "Expense approved"));
    }
}
