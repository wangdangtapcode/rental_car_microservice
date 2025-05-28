package com.example.vehicle_service.repository;

import com.example.vehicle_service.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findFirst20ByNameContainingIgnoreCase(String name);

    List<Vehicle> findTop20ByOrderByIdAsc();
    List<Vehicle> findByIdIn(List<Long> ids);
}
