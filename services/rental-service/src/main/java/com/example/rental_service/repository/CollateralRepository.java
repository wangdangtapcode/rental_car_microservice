package com.example.rental_service.repository;

import com.example.rental_service.model.Collateral;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CollateralRepository extends JpaRepository<Collateral, Long> {
}
