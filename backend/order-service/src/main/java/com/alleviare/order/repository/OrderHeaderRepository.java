package com.alleviare.order.repository;

import com.alleviare.order.entity.OrderHeader;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderHeaderRepository extends JpaRepository<OrderHeader, UUID> {
    List<OrderHeader> findByMrId(UUID mrId);
    List<OrderHeader> findByCustomerId(UUID customerId);
}
