package com.example.rental_service.repository;

import com.example.rental_service.model.PenaltyRule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PenaltyRuleRepository extends JpaRepository<PenaltyRule, Long> {
}
