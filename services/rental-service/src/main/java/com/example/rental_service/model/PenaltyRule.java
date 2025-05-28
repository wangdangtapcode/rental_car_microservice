package com.example.rental_service.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

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

    @OneToMany(mappedBy = "penaltyRule")
    @JsonIgnore
    private List<AppliedPenalty> appliedPenalties;
}
