package com.alleviare.order.controller;

import com.alleviare.common.dto.ApiResponse;
import com.alleviare.order.entity.OrderHeader;
import com.alleviare.order.repository.OrderHeaderRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderHeaderRepository orderRepository;

    public OrderController(OrderHeaderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderHeader>>> getAllOrders(@RequestParam(required = false) UUID mrId) {
        List<OrderHeader> list = (mrId != null) ? orderRepository.findByMrId(mrId) : orderRepository.findAll();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderHeader>> createOrder(@RequestBody OrderHeader order) {
        if (order.getItems() != null) {
            order.getItems().forEach(item -> item.setOrderHeader(order));
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(orderRepository.save(order), "POB Order created successfully"));
    }
}
