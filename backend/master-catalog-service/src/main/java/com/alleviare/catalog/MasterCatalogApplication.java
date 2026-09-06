package com.alleviare.catalog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = {"com.alleviare.catalog.entity", "com.alleviare.common.entity"})
public class MasterCatalogApplication {

    public static void main(String[] args) {
        SpringApplication.run(MasterCatalogApplication.class, args);
    }
}
