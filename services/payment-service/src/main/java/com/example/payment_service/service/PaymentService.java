package com.example.payment_service.service;

import com.example.payment_service.model.Invoice;
import com.example.payment_service.model.PenaltyRule;
import com.example.payment_service.repository.InvoiceRepository;
import com.example.payment_service.repository.PenaltyRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PenaltyRuleRepository penaltyRuleRepository;
    @Autowired
    private InvoiceRepository invoiceRepository;

    public List<PenaltyRule> getAllPenaltyRule() {
        return penaltyRuleRepository.findAll();
    }

    @Transactional
    public boolean createInvoice(Invoice invoiceData) {
        try {
            // Lấy danh sách ID xe cần tạo hóa đơn
            List<ContractVehicleDetail> contractVehicleDetails = invoiceData.getContractVehicleDetails();
            if (contractVehicleDetails == null || contractVehicleDetails.isEmpty()) {
                throw new RuntimeException("Không có xe nào được chọn để tạo hóa đơn");
            }

            // Tạo hóa đơn mới
            InvoiceDetail invoice = new InvoiceDetail();
            invoice.setPaymentDate(invoiceData.getPaymentDate());
            invoice.setEmployee(employee);
            invoice.setPenaltyAmount(invoiceData.getPenaltyAmount());
            invoice.setTotalAmount(invoiceData.getTotalAmount());
            invoice.setDueAmount(invoiceData.getDueAmount());

            List<ContractVehicleDetail> contractVehicleDetailList = new ArrayList<>();
            RentalContract contract = rentalContractRepository
                    .findContractByVehicleDetailId(contractVehicleDetails.get(0).getId());
            if (contract == null) {
                throw new EntityNotFoundException(
                        "Không tìm thấy hợp đồng thuê xe với ID xe: " + contractVehicleDetails.get(0).getId());
            }

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
                            "Xe " + vehicleDetail.getVehicle().getName() + " không ở trạng thái hợp lệ để tạo hóa đơn");
                }

                // Cập nhật ngày trả thực tế
                LocalDate actualReturnDate = contractVehicleDetail.getActualReturnDate();
                vehicleDetail.setActualReturnDate(actualReturnDate);
                vehicleDetail.getPenalties().clear();
                for (Penalty penalty : contractVehicleDetail.getPenalties()) {
                    vehicleDetail.getPenalties().add(penalty);
                    penalty.setContractVehicleDetail(vehicleDetail);
                }
                // Cập nhật trạng thái xe
                vehicleDetail.setStatus("COMPLETED");
                Vehicle vehicle = vehicleDetail.getVehicle();

                vehicleRepository.save(vehicle);
                vehicleDetail.setVehicle(vehicle);

                // Thêm xe vào danh sách xe của hóa đơn
                vehicleDetail.setInvoiceDetail(invoice);

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

            invoice.setContractVehicleDetails(contractVehicleDetailList);
            // Lưu hóa đơn
            invoiceDetailRepository.save(invoice);

            return true;
        } catch (Exception e) {
            System.err.println("Lỗi khi tạo hóa đơn: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
