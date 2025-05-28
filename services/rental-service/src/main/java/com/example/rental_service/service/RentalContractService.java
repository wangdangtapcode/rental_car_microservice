package com.example.rental_service.service;

import com.example.rental_service.model.Collateral;
import com.example.rental_service.model.ContractVehicleDetail;
import com.example.rental_service.model.RentalContract;
import com.example.rental_service.repository.RentalContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class RentalContractService {

    @Autowired
    private RentalContractRepository rentalContractRepository;

    @Transactional
    public boolean createRentalContract(RentalContract rentalContract) {
        try {

            for (ContractVehicleDetail contractVehicleDetail : rentalContract.getContractVehicleDetails()) {
                contractVehicleDetail.setRentalContract(rentalContract);
            }
            List<Collateral> collaterals = rentalContract.getCollaterals();
            for (Collateral collateral : collaterals) {
                collateral.setRentalContract(rentalContract);
            }
            rentalContract.setCollaterals(collaterals);

            rentalContractRepository.save(rentalContract);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Transactional
    public boolean updateContract(RentalContract rentalContract) {
        try {
            RentalContract rentalContractReal = rentalContractRepository.findById(rentalContract.getId())
                    .orElseThrow(() -> new RuntimeException("Contract not found"));

            rentalContractReal.setEmployeeId(rentalContract.getEmployeeId());
            rentalContractReal.setStatus("ACTIVE");

            for (ContractVehicleDetail contractVehicleDetail : rentalContract.getContractVehicleDetails()) {
                for (ContractVehicleDetail detail : rentalContractReal.getContractVehicleDetails()) {
                    if (detail.getVehicleId().equals(contractVehicleDetail.getVehicleId())) {
                        detail.setStatus("ACTIVE");
                        detail.setConditionNotes(contractVehicleDetail.getConditionNotes());
                        detail.setRentalContract(rentalContractReal);
                        break;
                    }
                }
            }
            // Lưu hợp đồng
            rentalContractRepository.save(rentalContractReal);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<RentalContract> getContractBookingByFullNameCustomer(List<RentalContract> customerIds) {
        List<Long> ids = new ArrayList<>();
        for (RentalContract rentalContract : customerIds) {
            ids.add(rentalContract.getCustomerId());
        }

        List<RentalContract> rentalContracts = rentalContractRepository.findByCustomerIdInAndStatusWithDetails(ids,
                "BOOKING");
        return rentalContracts;
    }

    public List<RentalContract> getContractActiveByFullNameCustomer(List<RentalContract> customerIds) {
        List<Long> ids = new ArrayList<>();
        for (RentalContract rentalContract : customerIds) {
            ids.add(rentalContract.getCustomerId());
        }
        List<RentalContract> rentalContracts = rentalContractRepository
                .findByCustomerIdInAndStatusWithDetails(ids,"ACTIVE");


        return rentalContracts;
    }
}
