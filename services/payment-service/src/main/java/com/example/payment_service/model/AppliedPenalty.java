package com.example.payment_service.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "applied_penalties") // Đã đổi tên từ penalties
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppliedPenalty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Float penaltyAmount;
    private String note;

    @Column(name = "contract_vehicle_detail_id", nullable = false)
    private Long contractVehicleDetailId;

    @ManyToOne()
    @JoinColumn(name = "penalty_rule_id", nullable = false)
    @JsonIgnore
    private PenaltyRule penaltyRule;

}
