package com.alleviare;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.zonky.test.db.postgres.embedded.EmbeddedPostgres;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.Statement;
import java.util.Arrays;
import java.util.Map;
import java.util.UUID;
import javax.sql.DataSource;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;

/** End-to-end API tests against a real PostgreSQL built from the repo's own migrations. */
@SpringBootTest
@AutoConfigureMockMvc
class PlatformApiTest {

    static final String PASSWORD = "Test-Password-123";
    static EmbeddedPostgres pg;

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry r) throws Exception {
        if (pg == null) {
            pg = EmbeddedPostgres.builder().start();
            try (Connection c = pg.getPostgresDatabase().getConnection(); Statement s = c.createStatement()) {
                // Stand-ins for Supabase-provided objects referenced by the migrations.
                s.execute("CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN; CREATE ROLE service_role NOLOGIN;");
                s.execute("CREATE SCHEMA auth; CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS 'SELECT NULL::uuid';"
                    + " CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql AS 'SELECT NULL::text';");
                s.execute(Files.readString(Path.of("../../backend/src/db/create_users_table.sql")));
                File[] migrations = new File("../../supabase/migrations").listFiles((d, n) -> n.endsWith(".sql"));
                Arrays.sort(migrations);
                for (File m : migrations) s.execute(Files.readString(m.toPath()));
                s.execute(Files.readString(Path.of("../../supabase/seed/dev_seed.sql")));
            }
        }
        r.add("spring.datasource.url", () -> pg.getJdbcUrl("postgres", "postgres"));
        r.add("spring.datasource.username", () -> "postgres");
        r.add("spring.datasource.password", () -> "postgres");
        r.add("app.jwt.secret", () -> "test-secret-test-secret-test-secret-123456");
        r.add("app.auth.web-only-roles", () -> "ADMIN");
    }

    @Autowired MockMvc mvc;
    @Autowired JdbcClient db;
    @Autowired PasswordEncoder encoder;
    @Autowired ObjectMapper json;

    static UUID companyA = UUID.fromString("a1111111-1111-1111-1111-111111111111");
    static UUID companyB;

    @BeforeAll
    static void noop() {}

    private void ensureData() {
        if (companyB != null) return;
        companyB = UUID.fromString("b2222222-2222-2222-2222-222222222222"); // seeded by migration 013
        String hash = encoder.encode(PASSWORD);
        for (String[] u : new String[][] {
                {"admin@alleviare.com", "ADMIN"}, {"mr@alleviare.com", "MR"}, {"manager@alleviare.com", "MANAGER"}}) {
            db.sql("""
                INSERT INTO public.users (email, password_hash, first_name, last_name, role, status)
                SELECT email, :h, first_name, last_name, :r, 'Active' FROM public.employees WHERE email = :e
                ON CONFLICT (email) DO NOTHING""").param("h", hash).param("r", u[1]).param("e", u[0]).update();
        }
        // A second tenant with its own employee, login and doctor.
        db.sql("""
            INSERT INTO public.employees (company_id, employee_code, first_name, last_name, email, status)
            VALUES (:c, 'B-1', 'Bea', 'Other', 'admin@novis.com', 'ACTIVE') ON CONFLICT DO NOTHING""").param("c", companyB).update();
        db.sql("""
            INSERT INTO public.users (email, password_hash, first_name, last_name, role, status)
            VALUES ('admin@novis.com', :h, 'Bea', 'Other', 'ADMIN', 'Active') ON CONFLICT (email) DO NOTHING""").param("h", hash).update();
        db.sql("INSERT INTO public.doctors (company_id, name) VALUES (:c, 'Dr. Novis Only')").param("c", companyB).update();
        db.sql("INSERT INTO public.doctors (company_id, name) VALUES (:c, 'Dr. Alleviare Only')").param("c", companyA).update();
    }

    private String login(String email, String platform) throws Exception {
        var res = mvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("email", email, "password", PASSWORD, "platform", platform))))
            .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        return json.readTree(res).get("token").asText();
    }

    @Test
    void protectedRoutesRequireLogin() throws Exception {
        ensureData();
        mvc.perform(get("/api/v1/doctors")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/v1/doctors").header("Authorization", "Bearer not-a-token")).andExpect(status().isUnauthorized());
    }

    @Test
    void wrongPasswordIsRejected() throws Exception {
        ensureData();
        mvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"mr@alleviare.com\",\"password\":\"nope\"}"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void adminCannotUseMobileApp() throws Exception {
        ensureData();
        mvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"admin@alleviare.com\",\"password\":\"" + PASSWORD + "\",\"platform\":\"app\"}"))
            .andExpect(status().isForbidden()).andExpect(jsonPath("$.code").value("PLATFORM_NOT_ALLOWED"));
    }

    @Test
    void roleComesFromAccountAndDrivesPermissions() throws Exception {
        ensureData();
        String mr = login("mr@alleviare.com", "app");
        mvc.perform(get("/api/v1/auth/me").header("Authorization", "Bearer " + mr))
            .andExpect(status().isOk()).andExpect(jsonPath("$.user.role").value("MR"));
        // MR may view and create doctors; a MANAGER may view but not create.
        mvc.perform(post("/api/v1/doctors").header("Authorization", "Bearer " + mr).contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Dr. Created By MR\"}")).andExpect(status().isCreated());
        String mgr = login("manager@alleviare.com", "web");
        mvc.perform(get("/api/v1/doctors").header("Authorization", "Bearer " + mgr)).andExpect(status().isOk());
        mvc.perform(post("/api/v1/doctors").header("Authorization", "Bearer " + mgr).contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Dr. Nope\"}")).andExpect(status().isForbidden());
    }

    private String body(org.springframework.test.web.servlet.ResultActions a) throws Exception {
        return a.andReturn().getResponse().getContentAsString();
    }

    private String idOf(String responseJson) throws Exception {
        return json.readTree(responseJson).at("/data/id").asText();
    }

    private org.springframework.test.web.servlet.ResultActions send(String method, String url, String token, String content) throws Exception {
        var b = org.springframework.test.web.servlet.request.MockMvcRequestBuilders.request(
            org.springframework.http.HttpMethod.valueOf(method), url).header("Authorization", "Bearer " + token);
        if (content != null) b = b.contentType(MediaType.APPLICATION_JSON).content(content);
        return mvc.perform(b);
    }

    @Test
    void orderLifecycleWithServerSidePricingAndApproval() throws Exception {
        ensureData();
        String admin = login("admin@alleviare.com", "web");
        String mr = login("mr@alleviare.com", "app");
        String mgr = login("manager@alleviare.com", "web");

        // MR cannot create products; admin can.
        send("POST", "/api/v1/products", mr, "{\"name\":\"X\",\"mrp\":1,\"ptr\":1,\"pts\":1}").andExpect(status().isForbidden());
        String product = idOf(body(send("POST", "/api/v1/products", admin,
            "{\"name\":\"CardioTest\",\"category\":\"Cardiology\",\"mrp\":145,\"ptr\":100,\"pts\":90}").andExpect(status().isCreated())));

        // MR books 10 units with a 10% discount; the client supplies no price.
        var created = send("POST", "/api/v1/orders", mr,
            "{\"discountPercent\":10,\"items\":[{\"productId\":\"" + product + "\",\"qty\":10}]}").andExpect(status().isCreated())
            .andExpect(jsonPath("$.data.grossAmount").value(1000.0)).andExpect(jsonPath("$.data.netAmount").value(900.0));
        String orderId = idOf(body(created));

        // Product of another company is rejected.
        String foreign = db.sql("INSERT INTO public.products (company_id, sku, name, mrp, ptr, pts) VALUES (:c,'FOREIGN','Foreign',1,1,1) RETURNING id")
            .param("c", companyB).query(UUID.class).single().toString();
        send("POST", "/api/v1/orders", mr, "{\"items\":[{\"productId\":\"" + foreign + "\",\"qty\":1}]}").andExpect(status().isBadRequest());

        // MR sees it, cannot approve; manager can; other tenant cannot see it.
        send("GET", "/api/v1/orders", mr, null).andExpect(jsonPath("$.data[0].items[0].productName").value("CardioTest"));
        send("PATCH", "/api/v1/orders/" + orderId + "/status", mr, "{\"status\":\"APPROVED\"}").andExpect(status().isForbidden());
        send("PATCH", "/api/v1/orders/" + orderId + "/status", mgr, "{\"status\":\"APPROVED\"}").andExpect(status().isOk());
        send("PATCH", "/api/v1/orders/" + orderId + "/status", mgr, "{\"status\":\"BOGUS\"}").andExpect(status().isBadRequest());
        send("GET", "/api/v1/orders?status=APPROVED", mgr, null).andExpect(jsonPath("$.count").value(1));
        String other = login("admin@novis.com", "web");
        send("GET", "/api/v1/orders", other, null).andExpect(jsonPath("$.count").value(0));
        send("PATCH", "/api/v1/orders/" + orderId + "/status", other, "{\"status\":\"REJECTED\"}").andExpect(status().isNotFound());
    }

    @Test
    void expenseClaimsAreApprovedByAnotherPerson() throws Exception {
        ensureData();
        String mr = login("mr@alleviare.com", "app");
        String mgr = login("manager@alleviare.com", "web");
        String claim = idOf(body(send("POST", "/api/v1/expenses", mr,
            "{\"travelKm\":10,\"fareRatePerKm\":5,\"dailyAllowance\":300,\"hotelCharges\":0}")
            .andExpect(status().isCreated()).andExpect(jsonPath("$.data.totalClaimAmount").value(350.0))));
        send("POST", "/api/v1/expenses", mr, "{\"dailyAllowance\":0}").andExpect(status().isBadRequest());
        send("PATCH", "/api/v1/expenses/" + claim + "/status", mr, "{\"status\":\"APPROVED\"}").andExpect(status().isForbidden());
        send("PATCH", "/api/v1/expenses/" + claim + "/status", mgr, "{\"status\":\"REJECTED\",\"remarks\":\"No receipt\"}").andExpect(status().isOk());
        send("GET", "/api/v1/expenses", mr, null).andExpect(jsonPath("$.data[0].managerRemarks").value("No receipt"));
    }

    @Test
    void dcrAttendanceLeaveAndTourPlans() throws Exception {
        ensureData();
        String mr = login("mr@alleviare.com", "app");
        String mgr = login("manager@alleviare.com", "web");
        String doctor = db.sql("SELECT id FROM public.doctors WHERE name = 'Dr. Alleviare Only'").query(UUID.class).single().toString();

        String visit = idOf(body(send("POST", "/api/v1/dcr", mr,
            "{\"targetType\":\"DOCTOR\",\"targetId\":\"" + doctor + "\",\"feedback\":\"Positive\"}").andExpect(status().isCreated())));
        send("POST", "/api/v1/dcr", mr, "{\"targetType\":\"DOCTOR\",\"targetId\":\"" + UUID.randomUUID() + "\"}").andExpect(status().isBadRequest());
        send("PATCH", "/api/v1/dcr/" + visit + "/status", mr, "{\"status\":\"APPROVED\"}").andExpect(status().isForbidden());
        send("PATCH", "/api/v1/dcr/" + visit + "/status", mgr, "{\"status\":\"APPROVED\"}").andExpect(status().isOk());
        send("GET", "/api/v1/dcr?status=APPROVED", mr, null).andExpect(jsonPath("$.data[0].targetName").value("Dr. Alleviare Only"));

        send("POST", "/api/v1/attendance/punch-in", mr, "{\"locationName\":\"Saket\"}").andExpect(status().isCreated());
        send("POST", "/api/v1/attendance/punch-in", mr, "{}").andExpect(status().isConflict());
        send("POST", "/api/v1/attendance/punch-out", mr, "{}").andExpect(status().isOk());
        send("POST", "/api/v1/attendance/punch-out", mr, "{}").andExpect(status().isConflict());

        send("POST", "/api/v1/attendance/leave/requests", mr,
            "{\"leaveType\":\"Sick Leave\",\"fromDate\":\"2026-12-01\",\"toDate\":\"2026-12-03\",\"reason\":\"fever\"}")
            .andExpect(status().isCreated()).andExpect(jsonPath("$.data.days").value(3));
        send("POST", "/api/v1/attendance/leave/requests", mr,
            "{\"leaveType\":\"Sick\",\"fromDate\":\"2026-12-05\",\"toDate\":\"2026-12-01\"}").andExpect(status().isBadRequest());
        send("GET", "/api/v1/attendance/leave/summary", mr, null)
            .andExpect(jsonPath("$.requests[0].status").value("PENDING"))
            .andExpect(jsonPath("$.balances[?(@.code=='SL')].total").value(10));

        send("POST", "/api/v1/tour-plans", mr, "{\"date\":\"2026-12-10\",\"route\":\"Saket Loop\",\"targetDoctors\":6}").andExpect(status().isCreated());
        send("GET", "/api/v1/tour-plans", mr, null).andExpect(jsonPath("$.data[0].route").value("Saket Loop"));
    }

    @Test
    void dashboardScopeFollowsRole() throws Exception {
        ensureData();
        String mr = login("mr@alleviare.com", "app");
        String mgr = login("manager@alleviare.com", "web");
        send("GET", "/api/v1/dashboard/summary", mr, null).andExpect(jsonPath("$.scope").value("SELF"));
        send("GET", "/api/v1/dashboard/summary", mgr, null).andExpect(jsonPath("$.scope").value("COMPANY"));
        send("GET", "/api/v1/employees", mr, null).andExpect(status().isForbidden());
        send("GET", "/api/v1/employees", mgr, null).andExpect(status().isOk());
    }

    @Test
    void administratorsProvisionEmployeesAndLogins() throws Exception {
        ensureData();
        String admin = login("admin@alleviare.com", "web");
        String mr = login("mr@alleviare.com", "app");
        String strong = "Another-Strong-Pass-1";

        // Only holders of user.manage / employee.create may do this.
        send("POST", "/api/v1/employees", mr, "{\"code\":\"X1\",\"firstName\":\"A\",\"lastName\":\"B\",\"email\":\"x1@alleviare.com\"}").andExpect(status().isForbidden());
        send("GET", "/api/v1/users", mr, null).andExpect(status().isForbidden());

        // A login needs an employee first.
        send("POST", "/api/v1/users", admin, "{\"email\":\"newrep@alleviare.com\",\"password\":\"" + strong + "\",\"role\":\"MR\"}").andExpect(status().isBadRequest());
        send("POST", "/api/v1/employees", admin, "{\"code\":\"MR-900\",\"firstName\":\"New\",\"lastName\":\"Rep\",\"email\":\"newrep@alleviare.com\"}").andExpect(status().isCreated());
        send("POST", "/api/v1/employees", admin, "{\"code\":\"MR-900\",\"firstName\":\"Dup\",\"lastName\":\"Rep\",\"email\":\"dup@alleviare.com\"}").andExpect(status().isConflict());

        send("POST", "/api/v1/users", admin, "{\"email\":\"newrep@alleviare.com\",\"password\":\"short\",\"role\":\"MR\"}").andExpect(status().isBadRequest());
        send("POST", "/api/v1/users", admin, "{\"email\":\"newrep@alleviare.com\",\"password\":\"" + strong + "\",\"role\":\"SUPER_ADMIN\"}").andExpect(status().isBadRequest());
        var created = send("POST", "/api/v1/users", admin, "{\"email\":\"newrep@alleviare.com\",\"password\":\"" + strong + "\",\"role\":\"MR\"}").andExpect(status().isCreated());
        String userId = idOf(body(created));
        send("POST", "/api/v1/users", admin, "{\"email\":\"newrep@alleviare.com\",\"password\":\"" + strong + "\",\"role\":\"MR\"}").andExpect(status().isConflict());

        // The new user can sign in on the mobile app and is limited to MR permissions.
        var res = mvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON)
            .content("{\"email\":\"newrep@alleviare.com\",\"password\":\"" + strong + "\",\"platform\":\"app\"}"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.user.currency").value("INR")).andReturn().getResponse().getContentAsString();
        String newTok = json.readTree(res).get("token").asText();
        send("GET", "/api/v1/employees", newTok, null).andExpect(status().isForbidden());

        // Another company's admin cannot touch this user; the same admin can deactivate and reset.
        String other = login("admin@novis.com", "web");
        send("PATCH", "/api/v1/users/" + userId + "/status", other, "{\"status\":\"Inactive\"}").andExpect(status().isNotFound());
        send("PATCH", "/api/v1/users/" + userId + "/status", admin, "{\"status\":\"Inactive\"}").andExpect(status().isOk());
        mvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON)
            .content("{\"email\":\"newrep@alleviare.com\",\"password\":\"" + strong + "\"}")).andExpect(status().isForbidden());
        send("PATCH", "/api/v1/users/" + userId + "/status", admin, "{\"status\":\"Active\"}").andExpect(status().isOk());
        send("POST", "/api/v1/users/" + userId + "/password", admin, "{\"password\":\"Reset-Strong-Pass-22\"}").andExpect(status().isOk());
        mvc.perform(post("/api/v1/auth/login").contentType(MediaType.APPLICATION_JSON)
            .content("{\"email\":\"newrep@alleviare.com\",\"password\":\"Reset-Strong-Pass-22\"}")).andExpect(status().isOk());
    }

    @Test
    void tenantsAreIsolated() throws Exception {
        ensureData();
        String a = login("admin@alleviare.com", "web");
        String b = login("admin@novis.com", "web");
        mvc.perform(get("/api/v1/doctors").header("Authorization", "Bearer " + a))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data[?(@.name=='Dr. Alleviare Only')]").isNotEmpty())
            .andExpect(jsonPath("$.data[?(@.name=='Dr. Novis Only')]").isEmpty());
        mvc.perform(get("/api/v1/doctors").header("Authorization", "Bearer " + b))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data[?(@.name=='Dr. Novis Only')]").isNotEmpty())
            .andExpect(jsonPath("$.data[?(@.name=='Dr. Alleviare Only')]").isEmpty());
    }
}
