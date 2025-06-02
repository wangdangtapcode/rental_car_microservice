package com.example.vehicle_service.config;

import com.example.vehicle_service.model.Vehicle;
import com.example.vehicle_service.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
public class DataInitializer {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Bean
    @Profile("docker")
    public CommandLineRunner initData() {
        return args -> {
            // Chỉ thêm dữ liệu nếu chưa có
            if (vehicleRepository.count() == 0) {
                Vehicle v1 = new Vehicle();
                v1.setName("Toyota Innova");
                v1.setLicensePlate("51H-12345");
                v1.setBrand("Toyota");
                v1.setType("MPV");
                v1.setSeatCount(7);
                v1.setManufactureYear(2020);
                v1.setDescription(
                        "Toyota Innova là dòng xe MPV rất phổ biến tại Việt Nam, được nhiều gia đình và doanh nghiệp tin dùng. Xe có thiết kế rộng rãi với 7 chỗ ngồi thoải mái, khoang hành lý lớn phù hợp cho những chuyến đi xa. Động cơ của Innova được đánh giá là bền bỉ, dễ bảo dưỡng. Ngoài ra, xe còn trang bị nhiều tính năng an toàn cơ bản, phù hợp với nhu cầu sử dụng hằng ngày. Đây là sự lựa chọn đáng tin cậy cho khách hàng muốn thuê xe gia đình.");
                v1.setRentalPrice(800000.0f);
                v1.setVehicleCondition("GOOD");
                v1.setOwnerType("STORE");

                Vehicle v2 = new Vehicle();
                v2.setName("Honda CR-V");
                v2.setLicensePlate("51G-67890");
                v2.setBrand("Honda");
                v2.setType("SUV");
                v2.setSeatCount(5);
                v2.setManufactureYear(2021);
                v2.setDescription(
                        "Honda CR-V mang lại trải nghiệm lái mượt mà và hiện đại. Xe có khoang nội thất tiện nghi, tích hợp nhiều công nghệ như hỗ trợ giữ làn, cảnh báo va chạm và phanh tự động. Không gian bên trong rộng rãi, ghế ngồi thoải mái cho cả 5 hành khách. CR-V có kiểu dáng thể thao, động cơ tiết kiệm nhiên liệu. Phù hợp với nhóm khách gia đình hoặc khách công tác dài ngày.");
                v2.setRentalPrice(1000000.0f);
                v2.setVehicleCondition("EXCELLENT");
                v2.setOwnerType("STORE");

                Vehicle v3 = new Vehicle();
                v3.setName("Hyundai Accent");
                v3.setLicensePlate("51F-23456");
                v3.setBrand("Hyundai");
                v3.setType("Sedan");
                v3.setSeatCount(5);
                v3.setManufactureYear(2019);
                v3.setDescription(
                        "Hyundai Accent là chiếc sedan nhỏ gọn lý tưởng cho các tuyến đường nội thành. Với thiết kế hiện đại và khả năng vận hành ổn định, Accent đáp ứng tốt nhu cầu đi lại cá nhân hoặc theo nhóm nhỏ. Xe có khả năng tiết kiệm nhiên liệu tốt, đồng thời nội thất được thiết kế tối ưu hóa không gian. Đây là mẫu xe phù hợp cho người mới lái hoặc khách cần di chuyển linh hoạt.");
                v3.setRentalPrice(600000.0f);
                v3.setVehicleCondition("GOOD");
                v3.setOwnerType("STORE");

                Vehicle v4 = new Vehicle();
                v4.setName("Kia Seltos");
                v4.setLicensePlate("51E-78901");
                v4.setBrand("Kia");
                v4.setType("SUV");
                v4.setSeatCount(5);
                v4.setManufactureYear(2022);
                v4.setDescription(
                        "Kia Seltos sở hữu ngoại hình bắt mắt với thiết kế trẻ trung, thể thao. Nội thất bên trong hiện đại, được trang bị màn hình giải trí trung tâm và hệ thống âm thanh sống động. Seltos phù hợp cho các chuyến đi du lịch hoặc công tác. Khả năng vận hành ổn định trên nhiều loại địa hình là một điểm mạnh lớn. Xe còn tích hợp nhiều tính năng an toàn như cảm biến, camera lùi.");
                v4.setRentalPrice(900000.0f);
                v4.setVehicleCondition("EXCELLENT");
                v4.setOwnerType("STORE");

                Vehicle v5 = new Vehicle();
                v5.setName("Ford Ranger");
                v5.setLicensePlate("51D-34567");
                v5.setBrand("Ford");
                v5.setType("Pickup");
                v5.setSeatCount(5);
                v5.setManufactureYear(2020);
                v5.setDescription(
                        "Ford Ranger là dòng bán tải mạnh mẽ, phù hợp cho những chuyến đi xa hoặc chuyên chở hàng hóa. Xe có động cơ Diesel bền bỉ, tiết kiệm nhiên liệu. Cabin rộng rãi, tiện nghi với các trang bị hiện đại như màn hình cảm ứng, điều hòa tự động. Ranger có khả năng vượt địa hình tốt, gầm cao giúp di chuyển dễ dàng ở vùng cao hay vùng ngập.");
                v5.setRentalPrice(1200000.0f);
                v5.setVehicleCondition("GOOD");
                v5.setOwnerType("STORE");

                Vehicle v6 = new Vehicle();
                v6.setName("Mazda CX-5");
                v6.setLicensePlate("51C-89012");
                v6.setBrand("Mazda");
                v6.setType("SUV");
                v6.setSeatCount(5);
                v6.setManufactureYear(2021);
                v6.setDescription(
                        "Mazda CX-5 nổi bật với thiết kế KODO sang trọng, tinh tế. Nội thất bọc da cao cấp, vô-lăng tích hợp nút điều khiển và hệ thống giải trí hiện đại. Xe vận hành êm ái, cách âm tốt, phù hợp cho khách hàng yêu cầu cao về trải nghiệm lái. CX-5 là lựa chọn tuyệt vời cho gia đình hoặc người đi công tác cần sự thoải mái và an toàn.");
                v6.setRentalPrice(950000.0f);
                v6.setVehicleCondition("EXCELLENT");
                v6.setOwnerType("STORE");

                Vehicle v7 = new Vehicle();
                v7.setName("Toyota Vios");
                v7.setLicensePlate("51B-45678");
                v7.setBrand("Toyota");
                v7.setType("Sedan");
                v7.setSeatCount(5);
                v7.setManufactureYear(2018);
                v7.setDescription(
                        "Toyota Vios là mẫu sedan được ưa chuộng nhiều năm liền nhờ độ bền cao và chi phí sử dụng thấp. Xe có thiết kế đơn giản nhưng hiệu quả, vận hành nhẹ nhàng trong đô thị. Nội thất tiện nghi cơ bản, phù hợp với nhu cầu di chuyển hàng ngày. Vios là lựa chọn hàng đầu cho người cần thuê xe giá rẻ và ổn định.");
                v7.setRentalPrice(550000.0f);
                v7.setVehicleCondition("GOOD");
                v7.setOwnerType("STORE");

                Vehicle v8 = new Vehicle();
                v8.setName("VinFast Lux A2.0");
                v8.setLicensePlate("51A-90123");
                v8.setBrand("VinFast");
                v8.setType("Sedan");
                v8.setSeatCount(5);
                v8.setManufactureYear(2020);
                v8.setDescription(
                        "VinFast Lux A2.0 mang lại trải nghiệm lái cao cấp nhờ khung gầm được phát triển từ BMW. Xe có nội thất rộng rãi, hệ thống giải trí cảm ứng, điều hòa tự động 2 vùng. Động cơ mạnh mẽ giúp xe tăng tốc nhanh, cảm giác lái đầm chắc. Đây là mẫu xe sedan cao cấp phù hợp với khách hàng doanh nhân hoặc người muốn trải nghiệm thương hiệu Việt.");
                v8.setRentalPrice(850000.0f);
                v8.setVehicleCondition("GOOD");
                v8.setOwnerType("STORE");

                Vehicle v9 = new Vehicle();
                v9.setName("Mitsubishi Xpander");
                v9.setLicensePlate("51K-56789");
                v9.setBrand("Mitsubishi");
                v9.setType("MPV");
                v9.setSeatCount(7);
                v9.setManufactureYear(2021);
                v9.setDescription(
                        "Mitsubishi Xpander được biết đến với khả năng chở 7 người thoải mái, thiết kế hiện đại và tiết kiệm nhiên liệu. Xe có khoang hành lý rộng, phù hợp cho gia đình hoặc nhóm du lịch. Nội thất bền bỉ, vận hành ổn định, giá thuê hợp lý. Đây là mẫu MPV phổ thông rất được ưa chuộng tại Việt Nam.");
                v9.setRentalPrice(750000.0f);
                v9.setVehicleCondition("GOOD");
                v9.setOwnerType("STORE");

                Vehicle v10 = new Vehicle();
                v10.setName("Suzuki Ertiga");
                v10.setLicensePlate("51M-01234");
                v10.setBrand("Suzuki");
                v10.setType("MPV");
                v10.setSeatCount(7);
                v10.setManufactureYear(2020);
                v10.setDescription(
                        "Suzuki Ertiga là mẫu xe 7 chỗ với giá thành hợp lý, thích hợp cho khách hàng thuê đi tỉnh hoặc đi du lịch cuối tuần. Xe có động cơ tiết kiệm, nội thất bố trí hợp lý, điều hòa 2 vùng cho hàng ghế sau. Ertiga nhẹ nhàng, dễ lái, phù hợp với nhu cầu sử dụng đơn giản.");
                v10.setRentalPrice(700000.0f);
                v10.setVehicleCondition("GOOD");
                v10.setOwnerType("STORE");

                Vehicle v11 = new Vehicle();
                v11.setName("Hyundai Tucson");
                v11.setLicensePlate("52A-67890");
                v11.setBrand("Hyundai");
                v11.setType("SUV");
                v11.setSeatCount(5);
                v11.setManufactureYear(2022);
                v11.setDescription(
                        "Hyundai Tucson mang dáng vẻ hiện đại, đậm chất châu Âu. Xe có không gian rộng rãi, trang bị hệ thống an toàn chủ động như cảnh báo điểm mù, hỗ trợ đỗ xe và cruise control thông minh. Động cơ mạnh mẽ, vận hành mượt mà. Tucson thích hợp cho những khách hàng yêu thích trải nghiệm cao cấp và an toàn.");
                v11.setRentalPrice(970000.0f);
                v11.setVehicleCondition("EXCELLENT");
                v11.setOwnerType("STORE");

                Vehicle v12 = new Vehicle();
                v12.setName("Kia Carnival");
                v12.setLicensePlate("52B-12345");
                v12.setBrand("Kia");
                v12.setType("MPV");
                v12.setSeatCount(7);
                v12.setManufactureYear(2023);
                v12.setDescription(
                        "Kia Carnival là mẫu xe gia đình cao cấp với thiết kế đậm chất sang trọng. Khoang nội thất cực kỳ rộng rãi, đầy đủ tiện nghi như ghế chỉnh điện, màn hình giải trí cho hàng ghế sau và điều hòa đa vùng. Xe phù hợp cho các chuyến du lịch dài hoặc đưa đón khách VIP.");
                v12.setRentalPrice(1100000.0f);
                v12.setVehicleCondition("EXCELLENT");
                v12.setOwnerType("STORE");

                Vehicle v13 = new Vehicle();
                v13.setName("Toyota Fortuner");
                v13.setLicensePlate("52C-23456");
                v13.setBrand("Toyota");
                v13.setType("SUV");
                v13.setSeatCount(7);
                v13.setManufactureYear(2021);
                v13.setDescription(
                        "Toyota Fortuner là mẫu SUV 7 chỗ mạnh mẽ, gầm cao, khả năng vận hành đa địa hình vượt trội. Nội thất tiện nghi, có nhiều tính năng hỗ trợ lái và an toàn. Xe thích hợp cho cả mục đích gia đình và công việc cần di chuyển đường dài hoặc khu vực đồi núi.");
                v13.setRentalPrice(1150000.0f);
                v13.setVehicleCondition("GOOD");
                v13.setOwnerType("STORE");

                Vehicle v14 = new Vehicle();
                v14.setName("Honda City");
                v14.setLicensePlate("52D-34567");
                v14.setBrand("Honda");
                v14.setType("Sedan");
                v14.setSeatCount(5);
                v14.setManufactureYear(2019);
                v14.setDescription(
                        "Honda City là lựa chọn lý tưởng cho khách hàng trẻ năng động. Với thiết kế thể thao, động cơ tiết kiệm và khả năng xử lý linh hoạt, City đáp ứng tốt nhu cầu di chuyển trong đô thị. Nội thất đơn giản nhưng tiện nghi, dễ sử dụng.");
                v14.setRentalPrice(580000.0f);
                v14.setVehicleCondition("GOOD");
                v14.setOwnerType("STORE");

                Vehicle v15 = new Vehicle();
                v15.setName("Mazda 3");
                v15.setLicensePlate("52E-45678");
                v15.setBrand("Mazda");
                v15.setType("Sedan");
                v15.setSeatCount(5);
                v15.setManufactureYear(2020);
                v15.setDescription(
                        "Mazda 3 mang đậm phong cách thiết kế KODO sắc sảo, nội thất hiện đại như một chiếc xe sang. Hệ thống cách âm tốt, cảm giác lái mượt mà và tiết kiệm nhiên liệu. Đây là mẫu xe rất được ưa chuộng trong phân khúc sedan hạng C.");
                v15.setRentalPrice(750000.0f);
                v15.setVehicleCondition("GOOD");
                v15.setOwnerType("STORE");

                vehicleRepository.saveAll(
                        java.util.Arrays.asList(v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15));
            }
        };
    }
}