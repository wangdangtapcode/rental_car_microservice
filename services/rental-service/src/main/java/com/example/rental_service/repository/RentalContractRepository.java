package com.example.rental_service.repository;

import com.example.rental_service.model.RentalContract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RentalContractRepository extends JpaRepository<RentalContract,Long> {
    @Query("SELECT DISTINCT rc FROM RentalContract rc " +
            "WHERE rc.customerId IN :customerIds AND rc.status = :status")
    List<RentalContract> findByCustomerIdInAndStatusWithDetails(
            @Param("customerIds") List<Long> customerIds,
            @Param("status") String status);
}
