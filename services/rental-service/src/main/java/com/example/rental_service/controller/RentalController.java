package com.example.rental_service.controller;

import com.example.rental_service.model.PenaltyRule;
import com.example.rental_service.model.RentalContract;
import com.example.rental_service.service.RentalService;
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
    private RentalService rentalService;

    @PostMapping("/update-from-invoice")
    public boolean updateFromInvoice(@RequestBody RentalContract rentalContract){
        return rentalService.updateFromInvoice(rentalContract);
    }
    @GetMapping("/penalty-rules/all")
    public List<PenaltyRule> getAllPenaltyRule() {
        return rentalService.getAllPenaltyRule();
    }
    @GetMapping("/contract-details/booked-vehicle-ids")
    public ResponseEntity<List<Long>> getBookedVehicleIds(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Long> vehicleIds = rentalService.findVehicleIdsBookedBetween(startDate, endDate);
        return ResponseEntity.ok(vehicleIds);
    }
    @PostMapping(value = "/create")
    public boolean createRentalContract(@RequestBody RentalContract rentalContract) {
        return rentalService.createRentalContract(rentalContract);
    }

    @PostMapping(value = "/update/{id}")
    public boolean updateContract(@PathVariable("id") Long id, @RequestBody RentalContract rentalContract) {
        return rentalService.updateContract(rentalContract);
    }

    @PostMapping(value = "/search-booked-by-customer-ids")
    public List<RentalContract> getContractBookingByFullNameCustomer(@RequestBody List<RentalContract> customerIds) {
        return rentalService.getContractBookingByFullNameCustomer(customerIds);
    }

    @PostMapping(value = "/search-active-by-customer-ids")
    public List<RentalContract> getContractActiveByFullNameCustomer(@RequestBody List<RentalContract> customerIds) {
        return rentalService.getContractActiveByFullNameCustomer(customerIds);
    }
}
