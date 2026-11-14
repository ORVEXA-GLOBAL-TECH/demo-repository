package com.alleviare.catalog;

import com.alleviare.common.Current;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/v1/doctors")
public class DoctorController {

    record DoctorRequest(@NotBlank String name, String qualification, String phone, String address, Integer monthlyTargetVisits) {}

    private final JdbcClient db;

    public DoctorController(JdbcClient db) {
        this.db = db;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('doctor.view') or hasAuthority('*')")
    public Map<String, Object> list(@RequestParam(required = false) String search) {
        String like = search == null || search.isBlank() ? "%" : "%" + search.trim() + "%";
        List<Map<String, Object>> rows = db.sql("""
                SELECT id, name, qualification, phone, clinic_address AS address, visit_frequency AS "monthlyTargetVisits"
                  FROM public.doctors
                 WHERE company_id = :company AND name ILIKE :like
                 ORDER BY name
                """)
            .param("company", Current.companyId())
            .param("like", like)
            .query().listOfRows();
        return Map.of("success", true, "count", rows.size(), "data", rows);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('doctor.create') or hasAuthority('*')")
    public Map<String, Object> create(@Valid @RequestBody DoctorRequest r) {
        Map<String, Object> row = db.sql("""
                INSERT INTO public.doctors (company_id, name, qualification, phone, clinic_address, visit_frequency)
                VALUES (:company, :name, :qual, :phone, :addr, :freq)
                RETURNING id, name, qualification, phone, clinic_address AS address, visit_frequency AS "monthlyTargetVisits"
                """)
            .param("company", Current.companyId())
            .param("name", r.name().trim())
            .param("qual", r.qualification())
            .param("phone", r.phone())
            .param("addr", r.address())
            .param("freq", r.monthlyTargetVisits() == null ? 2 : r.monthlyTargetVisits())
            .query().singleRow();
        return Map.of("success", true, "data", row);
    }
}
