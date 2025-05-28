package com.example.vehicle_service.model;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "vehicles") // Tên bảng trong DB
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String licensePlate;
    private String brand;
    private String type;
    private Integer seatCount;
    private Integer manufactureYear;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    private Float rentalPrice;
    private String vehicleCondition;
    private String ownerType;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VehicleImage> vehicleImages;
}