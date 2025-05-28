package com.example.rental_service.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "contract_vehicle_details") // Tên bảng trong DB
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContractVehicleDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Float rentalPrice;
    private LocalDate startDate;
    private LocalDate endDate;
    private String conditionNotes;
    private Float totalEstimatedAmount;
    private String status;
    private LocalDate actualReturnDate;

    @Column(name = "vehicle_id")
    private Long vehicleId;

    @Column(name = "invoice_id")
    private Long invoiceId;

    @ManyToOne()
    @JoinColumn(name = "rental_contract_id", nullable = false)
    @JsonIgnore
    private RentalContract rentalContract;

    // invoice_id sẽ được quản lý bởi PaymentService nếu cần tham chiếu ngược
    // Hoặc PaymentService sẽ lưu contract_vehicle_detail_id
}
