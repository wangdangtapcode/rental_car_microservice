package com.example.payment_service.repository;

import com.example.payment_service.model.PenaltyRule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PenaltyRuleRepository extends JpaRepository<PenaltyRule,Long> {
}
