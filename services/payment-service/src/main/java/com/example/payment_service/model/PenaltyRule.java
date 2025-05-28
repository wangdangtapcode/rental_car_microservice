package com.example.payment_service.model;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "penalty_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PenaltyRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Float defaultAmount;
    private String description;

}
