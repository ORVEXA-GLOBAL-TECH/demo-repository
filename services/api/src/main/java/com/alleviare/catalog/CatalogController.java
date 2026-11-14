package com.alleviare.catalog;

import com.alleviare.common.Scope;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Products, chemists and stockists (distributors). Doctors live in DoctorController. */
@RestController
@RequestMapping("/api/v1")
public class CatalogController {

    record ProductRequest(@NotBlank String name, String composition, String category, String packSize,
                          @NotNull @DecimalMin("0") BigDecimal mrp, @NotNull @DecimalMin("0") BigDecimal ptr,
                          @NotNull @DecimalMin("0") BigDecimal pts) {}

    record ChemistRequest(@NotBlank String name, String contactPerson, String phone, String drugLicense, String gstin,
                          String address, String preferredStockist) {}

    record StockistRequest(@NotBlank String name, String contactPerson, String phone, String gstin, String address) {}

    private final JdbcClient db;
    private final Scope scope;

    public CatalogController(JdbcClient db, Scope scope) {
        this.db = db;
        this.scope = scope;
    }

    private static String like(String s) {
        return s == null || s.isBlank() ? null : "%" + s.trim() + "%";
    }

    // ---- products ----

    @GetMapping("/products")
    @PreAuthorize("hasAuthority('product.view') or hasAuthority('*')")
    public Map<String, Object> products(@RequestParam(required = false) String search) {
        List<Map<String, Object>> rows = db.sql("""
                SELECT p.id, p.sku, p.name, p.composition, c.name AS category, p.pack_size AS "packSize", p.mrp, p.ptr, p.pts
                  FROM public.products p LEFT JOIN public.product_categories c ON c.id = p.category_id
                 WHERE p.company_id = :c AND p.is_active AND (CAST(:q AS text) IS NULL OR p.name ILIKE CAST(:q AS text)
                       OR p.composition ILIKE CAST(:q AS text))
                 ORDER BY p.name
                """).param("c", scope.companyId()).param("q", like(search)).query().listOfRows();
        return Map.of("success", true, "count", rows.size(), "data", rows);
    }

    @PostMapping("/products")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('product.create') or hasAuthority('*')")
    public Map<String, Object> createProduct(@Valid @RequestBody ProductRequest r) {
        UUID company = scope.companyId();
        UUID category = null;
        if (r.category() != null && !r.category().isBlank()) {
            category = db.sql("""
                    INSERT INTO public.product_categories (company_id, name) VALUES (:c, :n)
                    ON CONFLICT (company_id, name) DO UPDATE SET name = EXCLUDED.name RETURNING id
                    """).param("c", company).param("n", r.category().trim()).query(UUID.class).single();
        }
        String sku = "PRD-" + Long.toString(System.currentTimeMillis(), 36).toUpperCase() + ThreadLocalRandom.current().nextInt(10, 99);
        Map<String, Object> row = db.sql("""
                INSERT INTO public.products (company_id, sku, category_id, name, composition, pack_size, mrp, ptr, pts)
                VALUES (:c, :sku, :cat, :n, :comp, :pack, :mrp, :ptr, :pts)
                RETURNING id, sku, name, mrp, ptr, pts
                """).param("c", company).param("sku", sku).param("cat", category).param("n", r.name().trim())
            .param("comp", r.composition()).param("pack", r.packSize()).param("mrp", r.mrp()).param("ptr", r.ptr())
            .param("pts", r.pts()).query().singleRow();
        return Map.of("success", true, "data", row);
    }

    // ---- chemists ----

    @GetMapping("/chemists")
    @PreAuthorize("hasAuthority('chemist.view') or hasAuthority('*')")
    public Map<String, Object> chemists(@RequestParam(required = false) String search) {
        List<Map<String, Object>> rows = db.sql("""
                SELECT id, name, contact_person AS "contactPerson", phone, drug_license_no AS "drugLicense", gstin, address,
                       preferred_stockist AS "preferredStockist"
                  FROM public.chemists WHERE company_id = :c AND (CAST(:q AS text) IS NULL OR name ILIKE CAST(:q AS text)
                       OR contact_person ILIKE CAST(:q AS text))
                 ORDER BY name
                """).param("c", scope.companyId()).param("q", like(search)).query().listOfRows();
        return Map.of("success", true, "count", rows.size(), "data", rows);
    }

    @PostMapping("/chemists")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('chemist.create') or hasAuthority('*')")
    public Map<String, Object> createChemist(@Valid @RequestBody ChemistRequest r) {
        Map<String, Object> row = db.sql("""
                INSERT INTO public.chemists (company_id, name, contact_person, phone, drug_license_no, gstin, address, preferred_stockist)
                VALUES (:c, :n, :cp, :ph, :dl, :g, :a, :ps) RETURNING id, name
                """).param("c", scope.companyId()).param("n", r.name().trim()).param("cp", r.contactPerson())
            .param("ph", r.phone()).param("dl", r.drugLicense()).param("g", r.gstin()).param("a", r.address())
            .param("ps", r.preferredStockist()).query().singleRow();
        return Map.of("success", true, "data", row);
    }

    // ---- stockists ----

    @GetMapping("/stockists")
    @PreAuthorize("hasAuthority('order.view') or hasAuthority('*')")
    public Map<String, Object> stockists() {
        List<Map<String, Object>> rows = db.sql("""
                SELECT id, name, contact_person AS "contactPerson", phone, gstin, address
                  FROM public.distributors WHERE company_id = :c ORDER BY name
                """).param("c", scope.companyId()).query().listOfRows();
        return Map.of("success", true, "count", rows.size(), "data", rows);
    }

    @PostMapping("/stockists")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('stockist.create') or hasAuthority('*')")
    public Map<String, Object> createStockist(@Valid @RequestBody StockistRequest r) {
        String code = "STK-" + Long.toString(System.currentTimeMillis(), 36).toUpperCase() + ThreadLocalRandom.current().nextInt(10, 99);
        Map<String, Object> row = db.sql("""
                INSERT INTO public.distributors (company_id, code, name, contact_person, phone, gstin, address)
                VALUES (:c, :code, :n, :cp, :ph, :g, :a) RETURNING id, name
                """).param("c", scope.companyId()).param("code", code).param("n", r.name().trim())
            .param("cp", r.contactPerson()).param("ph", r.phone()).param("g", r.gstin()).param("a", r.address())
            .query().singleRow();
        return Map.of("success", true, "data", row);
    }
}
