package com.example.payment_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate paymentDate;
    private Float totalPenaltyAmount;
    private Float dueAmount;
    private Float totalRentAmount;

    @Column(name = "employee_id")
    private Long employeeId;

}
