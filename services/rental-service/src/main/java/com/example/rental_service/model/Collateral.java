package com.example.rental_service.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "collaterals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Collateral {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    @ManyToOne()
    @JoinColumn(name = "rental_contract_id", nullable = false)
    @JsonIgnore
    private RentalContract rentalContract;
}
