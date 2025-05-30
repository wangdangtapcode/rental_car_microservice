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
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class RentalService {

    @Autowired
    private RentalContractRepository rentalContractRepository;
    @Autowired
    private ContractVehicleDetailRepository contractVehicleDetailRepository;
    @Autowired
    private PenaltyRuleRepository penaltyRuleRepository;

    @Transactional
    public boolean updateFromInvoice(RentalContract contractUpdates) {
        try {
            // 1. Kiểm tra đầu vào: Danh sách chi tiết xe cần cập nhật
            List<ContractVehicleDetail> vehicleUpdateDetails = contractUpdates.getContractVehicleDetails();
            if (vehicleUpdateDetails == null || vehicleUpdateDetails.isEmpty()) {
                throw new IllegalArgumentException("Không có xe nào được chọn để cập nhật từ hóa đơn.");
            }

            // 2. Lấy đối tượng hợp đồng (RentalContract) đang tồn tại từ cơ sở dữ liệu
            RentalContract persistentContract = rentalContractRepository.findById(contractUpdates.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Hợp đồng không tìm thấy với ID: " + contractUpdates.getId()));

            // 3. Để tra cứu chi tiết xe hiệu quả, chuyển danh sách chi tiết xe của hợp đồng đang có thành Map
            // key là ID của ContractVehicleDetail, value là chính đối tượng đó.
            Map<Long, ContractVehicleDetail> persistentVehicleDetailsMap = persistentContract.getContractVehicleDetails()
                    .stream()
                    .collect(Collectors.toMap(ContractVehicleDetail::getId, Function.identity()));

            // 4. Xử lý từng chi tiết xe được yêu cầu cập nhật
            for (ContractVehicleDetail updateInfo : vehicleUpdateDetails) {
                // Lấy chi tiết xe tương ứng từ hợp đồng đã tải bằng ID
                ContractVehicleDetail targetVehicleDetail = persistentVehicleDetailsMap.get(updateInfo.getId());

                if (targetVehicleDetail == null) {
                    throw new EntityNotFoundException(
                            "Chi tiết xe thuê (ID: " + updateInfo.getId() + ") không tồn tại trong hợp đồng (ID: " + persistentContract.getId() + ").");
                }

                // 5. Kiểm tra trạng thái xe trước khi cập nhật (sử dụng hằng số)
                if (!"ACTIVE".equals(targetVehicleDetail.getStatus())) { // Thay thế "ACTIVE" bằng STATUS_ACTIVE
                    throw new IllegalStateException(
                            "Xe " + targetVehicleDetail.getVehicleId() + " không ở trạng thái 'ACTIVE' để cập nhật từ hóa đơn.");
                }

                // 6. Áp dụng các thay đổi vào chi tiết xe đang có
                targetVehicleDetail.setActualReturnDate(updateInfo.getActualReturnDate());
                targetVehicleDetail.setInvoiceId(updateInfo.getInvoiceId()); // Giả sử invoiceId đến từ updateInfo

                // Cập nhật danh sách các hình phạt (AppliedPenalty)
                targetVehicleDetail.getAppliedPenalties().clear(); // Xóa các hình phạt cũ
                if (updateInfo.getAppliedPenalties() != null) {
                    for (AppliedPenalty newPenalty : updateInfo.getAppliedPenalties()) {
                        newPenalty.setContractVehicleDetail(targetVehicleDetail); // Thiết lập quan hệ hai chiều
                        targetVehicleDetail.getAppliedPenalties().add(newPenalty);
                    }
                }

                targetVehicleDetail.setStatus("COMPLETED"); // Thay thế "COMPLETED" bằng STATUS_COMPLETED
            }

            // 7. Sau khi cập nhật tất cả chi tiết xe, kiểm tra xem toàn bộ hợp đồng có thể đánh dấu là HOÀN THÀNH không
            boolean allContractVehiclesCompleted = persistentContract.getContractVehicleDetails().stream()
                    .allMatch(detail -> "COMPLETED".equals(detail.getStatus())); // Sử dụng STATUS_COMPLETED

            if (allContractVehiclesCompleted) {
                persistentContract.setStatus("COMPLETED"); // Sử dụng STATUS_COMPLETED
            }

            // 8. Lưu thay đổi vào cơ sở dữ liệu
            rentalContractRepository.save(persistentContract);
            return true;

        } catch (IllegalArgumentException | EntityNotFoundException | IllegalStateException e) {
            // Ghi log các lỗi nghiệp vụ cụ thể, có thể dự đoán được
            System.err.println("Lỗi cập nhật hóa đơn do vi phạm quy tắc nghiệp vụ: " + e.getMessage());
            // e.printStackTrace(); // Tùy thuộc vào chiến lược ghi log cho lỗi nghiệp vụ
            return false;
        } catch (Exception e) {
            // Ghi log các lỗi không mong muốn khác
            System.err.println("Lỗi không mong muốn khi cập nhật từ hóa đơn: " + e.getMessage());
            e.printStackTrace(); // Quan trọng để debug các vấn đề không lường trước
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
