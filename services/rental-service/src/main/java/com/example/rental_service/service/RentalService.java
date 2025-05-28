package com.example.rental_service.service;

import com.example.rental_service.model.*;
import com.example.rental_service.repository.ContractVehicleDetailRepository;
import com.example.rental_service.repository.PenaltyRuleRepository;
import com.example.rental_service.repository.RentalContractRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class RentalService {

    @Autowired
    private RentalContractRepository rentalContractRepository;
    @Autowired
    private ContractVehicleDetailRepository contractVehicleDetailRepository;
    @Autowired
    private PenaltyRuleRepository penaltyRuleRepository;

    @Transactional
    public boolean updateFromInvoice(RentalContract rentalContract) {
        try {

            // Lấy danh sách ID xe cần tạo hóa đơn
            List<ContractVehicleDetail> contractVehicleDetails = rentalContract.getContractVehicleDetails();
            if (contractVehicleDetails == null || contractVehicleDetails.isEmpty()) {
                throw new RuntimeException("Không có xe nào được chọn để tạo hóa đơn");
            }

            List<ContractVehicleDetail> contractVehicleDetailList = new ArrayList<>();
            RentalContract contract = rentalContractRepository.findById(rentalContract.getId())
                    .orElseThrow(() -> new RuntimeException("Contract not found"));

            // Xử lý từng xe
            for (ContractVehicleDetail contractVehicleDetail : contractVehicleDetails) {
                // Tìm chi tiết xe thuê
                ContractVehicleDetail vehicleDetail = null;
                for (ContractVehicleDetail detail : contract.getContractVehicleDetails()) {
                    if (detail.getId().equals(contractVehicleDetail.getId())) {
                        vehicleDetail = detail;
                        break;
                    }
                }

                if (vehicleDetail == null) {
                    throw new EntityNotFoundException(
                            "Không tìm thấy chi tiết xe thuê với ID: " + contractVehicleDetail.getId());
                }

                // Kiểm tra trạng thái xe
                if (!"ACTIVE".equals(vehicleDetail.getStatus())) {
                    throw new RuntimeException(
                            "Xe " + vehicleDetail.getVehicleId() + " không ở trạng thái hợp lệ để tạo hóa đơn");
                }

                // Cập nhật ngày trả thực tế
                LocalDate actualReturnDate = contractVehicleDetail.getActualReturnDate();
                vehicleDetail.setActualReturnDate(actualReturnDate);
                vehicleDetail.getAppliedPenalties().clear();
                for (AppliedPenalty penalty : contractVehicleDetail.getAppliedPenalties()) {
                    vehicleDetail.getAppliedPenalties().add(penalty);
                    penalty.setContractVehicleDetail(vehicleDetail);
                }
                // Cập nhật trạng thái xe
                vehicleDetail.setStatus("COMPLETED");

                // Thêm xe vào danh sách xe của hóa đơn
                vehicleDetail.setInvoiceId(contractVehicleDetail.getInvoiceId());

                contractVehicleDetailList.add(vehicleDetail);

                // Kiểm tra và cập nhật trạng thái hợp đồng
                boolean allCompleted = true;
                for (ContractVehicleDetail detail : contract.getContractVehicleDetails()) {
                    if (!"COMPLETED".equals(detail.getStatus())) {
                        allCompleted = false;
                        break;
                    }
                }

                if (allCompleted) {
                    contract.setStatus("COMPLETED");
                    rentalContractRepository.save(contract);
                }

            }
            return true;
        } catch (Exception e) {
            System.err.println("Lỗi khi tạo hóa đơn: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public List<PenaltyRule> getAllPenaltyRule() {
        return penaltyRuleRepository.findAll();
    }

    @Transactional
    public List<Long> findVehicleIdsBookedBetween(LocalDate startDate, LocalDate endDate) {
        return contractVehicleDetailRepository.findVehicleIdsByDateRangeAndStatus(startDate, endDate,
                List.of("ACTIVE", "BOOKING"));
    }

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
                .findByCustomerIdInAndStatusWithDetails(ids, "ACTIVE");

        return rentalContracts;
    }
}
