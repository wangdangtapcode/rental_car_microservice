package com.example.rental_service.repository;

import com.example.rental_service.model.ContractVehicleDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ContractVehicleDetailRepository extends JpaRepository<ContractVehicleDetail, Long> {
    @Query("SELECT DISTINCT cvd.vehicleId FROM ContractVehicleDetail cvd " +
            "WHERE ((cvd.startDate <= :endDate AND cvd.endDate >= :startDate) " +
            "OR (cvd.startDate <= :endDate AND (cvd.actualReturnDate IS NULL OR cvd.actualReturnDate >= :startDate))) " +
            "AND cvd.status IN :statuses")
    List<Long> findVehicleIdsByDateRangeAndStatus(@Param("startDate") LocalDate startDate,
                                                  @Param("endDate") LocalDate endDate,
                                                  @Param("statuses") List<String> statuses);

    @Query("SELECT DISTINCT cvd.vehicleId FROM ContractVehicleDetail cvd " +
            "WHERE cvd.status IN :statuses " +
            "AND cvd.startDate <= :checkDate " +
            "AND (cvd.actualReturnDate IS NULL OR cvd.actualReturnDate > :checkDate)")
    List<Long> findVehicleIdsByDateAndStatus(@Param("checkDate") LocalDate checkDate,
                                             @Param("statuses") List<String> statuses);
}
