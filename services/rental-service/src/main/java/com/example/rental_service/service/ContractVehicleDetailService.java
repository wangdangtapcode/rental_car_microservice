package com.example.rental_service.service;

import com.example.rental_service.repository.ContractVehicleDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContractVehicleDetailService {

    @Autowired
    private  ContractVehicleDetailRepository contractVehicleDetailRepository;


    public List<Long> findVehicleIdsBookedBetween(LocalDate startDate, LocalDate endDate) {
        return contractVehicleDetailRepository.findVehicleIdsByDateRangeAndStatus(startDate, endDate, List.of("ACTIVE", "BOOKING"));
    }

    public List<Long> findVehicleIdsActiveOrBookingOnDate(LocalDate date) {

        return contractVehicleDetailRepository.findVehicleIdsByDateAndStatus(date, List.of("ACTIVE", "BOOKING"));
    }
}
