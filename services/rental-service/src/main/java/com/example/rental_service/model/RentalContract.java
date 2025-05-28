package com.example.rental_service.model;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "rental_contracts") // Tên bảng trong DB
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RentalContract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate createdDate;
    private Float depositAmount;
    private Float dueAmount;
    private Float totalEstimatedAmount;
    private String status;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "employee_id")
    private Long employeeId;

    @OneToMany(mappedBy = "rentalContract", cascade = CascadeType.ALL)
    private List<ContractVehicleDetail> contractVehicleDetails;

    @OneToMany(mappedBy = "rentalContract", cascade = CascadeType.ALL)
    private List<Collateral> collaterals;
}
