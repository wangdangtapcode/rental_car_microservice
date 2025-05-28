package com.example.rental_service.controller;

import com.example.rental_service.model.RentalContract;
import com.example.rental_service.service.ContractVehicleDetailService;
import com.example.rental_service.service.RentalContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/rentals")
public class RentalController {

    @Autowired
    private  ContractVehicleDetailService contractVehicleDetailService;
    @Autowired
    private RentalContractService rentalContractService;

    @GetMapping("/contract-details/booked-vehicle-ids")
    public ResponseEntity<List<Long>> getBookedVehicleIds(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Long> vehicleIds = contractVehicleDetailService.findVehicleIdsBookedBetween(startDate, endDate);
        return ResponseEntity.ok(vehicleIds);
    }
    @PostMapping(value = "/create")
    public boolean createRentalContract(@RequestBody RentalContract rentalContract) {
        return rentalContractService.createRentalContract(rentalContract);
    }

    @PostMapping(value = "/update/{id}")
    public boolean updateContract(@PathVariable("id") Long id, @RequestBody RentalContract rentalContract) {
        return rentalContractService.updateContract(rentalContract);
    }

    @PostMapping(value = "/search-booked-by-customer-ids")
    public List<RentalContract> getContractBookingByFullNameCustomer(@RequestBody List<RentalContract> customerIds) {
        return rentalContractService.getContractBookingByFullNameCustomer(customerIds);
    }

    @PostMapping(value = "/search-active-by-customer-ids")
    public List<RentalContract> getContractActiveByFullNameCustomer(@RequestBody List<RentalContract> customerIds) {
        return rentalContractService.getContractActiveByFullNameCustomer(customerIds);
    }
}
