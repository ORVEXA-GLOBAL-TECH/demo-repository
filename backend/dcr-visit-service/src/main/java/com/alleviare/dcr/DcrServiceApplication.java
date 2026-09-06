package com.alleviare.dcr;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = {"com.alleviare.dcr.entity", "com.alleviare.common.entity"})
public class DcrServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(DcrServiceApplication.class, args);
    }
}
