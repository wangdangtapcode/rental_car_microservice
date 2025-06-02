package com.example.rental_service.config;

import com.example.rental_service.model.*;
import com.example.rental_service.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.time.LocalDate;

@Configuration
public class DataInitializer {

    @Autowired
    private RentalContractRepository rentalContractRepository;
    @Autowired
    private ContractVehicleDetailRepository contractVehicleDetailRepository;
    @Autowired
    private PenaltyRuleRepository penaltyRuleRepository;
    @Autowired
    private CollateralRepository collateralRepository;

    @Bean
    @Profile("docker")
    public CommandLineRunner initData() {
        return args -> {
            // Chỉ thêm dữ liệu nếu chưa có
            if (rentalContractRepository.count() == 0) {
                // Thêm rental contracts
                RentalContract rc1 = new RentalContract();
                rc1.setCreatedDate(LocalDate.parse("2025-05-09"));
                rc1.setDepositAmount(480000.0f);
                rc1.setDueAmount(1920000.0f);
                rc1.setTotalEstimatedAmount(2400000.0f);
                rc1.setStatus("BOOKING");
                rc1.setCustomerId(1L);

                RentalContract rc2 = new RentalContract();
                rc2.setCreatedDate(LocalDate.parse("2025-05-09"));
                rc2.setDepositAmount(600000.0f);
                rc2.setDueAmount(2400000.0f);
                rc2.setTotalEstimatedAmount(3000000.0f);
                rc2.setStatus("BOOKING");
                rc2.setCustomerId(2L);

                RentalContract rc3 = new RentalContract();
                rc3.setCreatedDate(LocalDate.parse("2025-05-09"));
                rc3.setDepositAmount(360000.0f);
                rc3.setDueAmount(1440000.0f);
                rc3.setTotalEstimatedAmount(1800000.0f);
                rc3.setStatus("BOOKING");
                rc3.setCustomerId(3L);

                RentalContract rc4 = new RentalContract();
                rc4.setCreatedDate(LocalDate.parse("2025-05-09"));
                rc4.setDepositAmount(840000.0f);
                rc4.setDueAmount(3360000.0f);
                rc4.setTotalEstimatedAmount(4200000.0f);
                rc4.setStatus("ACTIVE");
                rc4.setCustomerId(4L);
                rc4.setEmployeeId(11L);

                RentalContract rc5 = new RentalContract();
                rc5.setCreatedDate(LocalDate.parse("2025-05-09"));
                rc5.setDepositAmount(600000.0f);
                rc5.setDueAmount(2400000.0f);
                rc5.setTotalEstimatedAmount(3000000.0f);
                rc5.setStatus("ACTIVE");
                rc5.setCustomerId(5L);
                rc5.setEmployeeId(11L);

                rentalContractRepository.saveAll(java.util.Arrays.asList(rc1, rc2, rc3, rc4, rc5));

                // Thêm contract vehicle details
                ContractVehicleDetail cvd1 = new ContractVehicleDetail();
                cvd1.setRentalPrice(800000.0f);
                cvd1.setStartDate(LocalDate.parse("2025-05-09"));
                cvd1.setEndDate(LocalDate.parse("2025-05-11"));
                cvd1.setTotalEstimatedAmount(2400000.0f);
                cvd1.setStatus("BOOKING");
                cvd1.setVehicleId(1L);
                cvd1.setRentalContract(rc1);

                ContractVehicleDetail cvd2 = new ContractVehicleDetail();
                cvd2.setRentalPrice(1000000.0f);
                cvd2.setStartDate(LocalDate.parse("2025-05-09"));
                cvd2.setEndDate(LocalDate.parse("2025-05-11"));
                cvd2.setTotalEstimatedAmount(3000000.0f);
                cvd2.setStatus("BOOKING");
                cvd2.setVehicleId(2L);
                cvd2.setRentalContract(rc2);

                ContractVehicleDetail cvd3 = new ContractVehicleDetail();
                cvd3.setRentalPrice(600000.0f);
                cvd3.setStartDate(LocalDate.parse("2025-05-09"));
                cvd3.setEndDate(LocalDate.parse("2025-05-11"));
                cvd3.setTotalEstimatedAmount(1800000.0f);
                cvd3.setStatus("BOOKING");
                cvd3.setVehicleId(3L);
                cvd3.setRentalContract(rc3);

                ContractVehicleDetail cvd4 = new ContractVehicleDetail();
                cvd4.setRentalPrice(900000.0f);
                cvd4.setStartDate(LocalDate.parse("2025-05-09"));
                cvd4.setEndDate(LocalDate.parse("2025-05-10"));
                cvd4.setTotalEstimatedAmount(1800000.0f);
                cvd4.setConditionNotes("EXCELLENT");
                cvd4.setStatus("ACTIVE");
                cvd4.setVehicleId(4L);
                cvd4.setRentalContract(rc4);

                ContractVehicleDetail cvd5 = new ContractVehicleDetail();
                cvd5.setRentalPrice(1200000.0f);
                cvd5.setStartDate(LocalDate.parse("2025-05-09"));
                cvd5.setEndDate(LocalDate.parse("2025-05-10"));
                cvd5.setTotalEstimatedAmount(2400000.0f);
                cvd5.setConditionNotes("GOOD");
                cvd5.setStatus("ACTIVE");
                cvd5.setVehicleId(4L);
                cvd5.setRentalContract(rc4);

                ContractVehicleDetail cvd6 = new ContractVehicleDetail();
                cvd6.setRentalPrice(950000.0f);
                cvd6.setStartDate(LocalDate.parse("2025-05-09"));
                cvd6.setEndDate(LocalDate.parse("2025-05-10"));
                cvd6.setTotalEstimatedAmount(1900000.0f);
                cvd6.setConditionNotes("EXCELLENT");
                cvd6.setStatus("ACTIVE");
                cvd6.setVehicleId(6L);
                cvd6.setRentalContract(rc5);

                ContractVehicleDetail cvd7 = new ContractVehicleDetail();
                cvd7.setRentalPrice(550000.0f);
                cvd7.setStartDate(LocalDate.parse("2025-05-09"));
                cvd7.setEndDate(LocalDate.parse("2025-05-10"));
                cvd7.setTotalEstimatedAmount(1100000.0f);
                cvd7.setConditionNotes("GOOD");
                cvd7.setStatus("ACTIVE");
                cvd7.setVehicleId(7L);
                cvd7.setRentalContract(rc5);

                contractVehicleDetailRepository
                        .saveAll(java.util.Arrays.asList(cvd1, cvd2, cvd3, cvd4, cvd5, cvd6, cvd7));

                // Thêm penalty rules
                PenaltyRule pr1 = new PenaltyRule();
                pr1.setName("Vi phạm giao thông");
                pr1.setDefaultAmount(500000.0f);
                pr1.setDescription("Phạt do vi phạm luật giao thông");

                PenaltyRule pr2 = new PenaltyRule();
                pr2.setName("Hư hỏng xe");
                pr2.setDefaultAmount(1000000.0f);
                pr2.setDescription("Phạt do làm hư hỏng xe");

                PenaltyRule pr3 = new PenaltyRule();
                pr3.setName("Trễ hạn trả xe");
                pr3.setDefaultAmount(200000.0f);
                pr3.setDescription("Phạt do trả xe muộn");

                PenaltyRule pr4 = new PenaltyRule();
                pr4.setName("Không đổ đầy xăng khi trả xe");
                pr4.setDefaultAmount(300000.0f);
                pr4.setDescription("Phạt do không đổ đầy bình xăng khi hoàn trả xe");

                PenaltyRule pr5 = new PenaltyRule();
                pr5.setName("Làm mất giấy tờ xe");
                pr5.setDefaultAmount(800000.0f);
                pr5.setDescription("Phạt do làm mất giấy đăng ký xe hoặc bảo hiểm xe");

                PenaltyRule pr6 = new PenaltyRule();
                pr6.setName("Làm mất phụ kiện đi kèm");
                pr6.setDefaultAmount(200000.0f);
                pr6.setDescription("Phạt do làm mất phụ kiện như dây sạc, đồ cứu hộ, thảm sàn");

                PenaltyRule pr7 = new PenaltyRule();
                pr7.setName("Không vệ sinh xe khi trả");
                pr7.setDefaultAmount(100000.0f);
                pr7.setDescription("Phạt do không vệ sinh sạch sẽ xe khi hoàn trả");

                PenaltyRule pr8 = new PenaltyRule();
                pr8.setName("Lái xe ngoài khu vực cho phép");
                pr8.setDefaultAmount(600000.0f);
                pr8.setDescription("Phạt do đưa xe ra ngoài khu vực đã cam kết");

                PenaltyRule pr9 = new PenaltyRule();
                pr9.setName("Chở quá số người quy định");
                pr9.setDefaultAmount(400000.0f);
                pr9.setDescription("Phạt do chở quá số lượng hành khách cho phép theo thiết kế xe");

                penaltyRuleRepository.saveAll(java.util.Arrays.asList(pr1, pr2, pr3, pr4, pr5, pr6, pr7, pr8, pr9));

                // Thêm collaterals
                Collateral c1 = new Collateral();
                c1.setDescription("CMND bản sao");
                c1.setRentalContract(rc1);

                Collateral c2 = new Collateral();
                c2.setDescription("Hộ khẩu bản sao");
                c2.setRentalContract(rc2);

                Collateral c3 = new Collateral();
                c3.setDescription("Sổ hồng bản sao");
                c3.setRentalContract(rc3);

                Collateral c4 = new Collateral();
                c4.setDescription("Hộ khẩu bản sao");
                c4.setRentalContract(rc4);

                Collateral c5 = new Collateral();
                c5.setDescription("CMND bản sao");
                c5.setRentalContract(rc4);

                Collateral c6 = new Collateral();
                c6.setDescription("CMND bản sao");
                c6.setRentalContract(rc5);

                Collateral c7 = new Collateral();
                c7.setDescription("Hộ khẩu bản sao");
                c7.setRentalContract(rc5);

                collateralRepository.saveAll(java.util.Arrays.asList(c1, c2, c3, c4, c5, c6, c7));
            }
        };
    }
}