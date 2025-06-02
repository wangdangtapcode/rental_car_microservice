package com.example.user_service.config;

import com.example.user_service.model.Customer;
import com.example.user_service.model.Employee;
import com.example.user_service.model.User;
import com.example.user_service.repository.CustomerRepository;
import com.example.user_service.repository.EmployeeRepository;
import com.example.user_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
public class DataInitializer {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private EmployeeRepository employeeRepository;

    @Bean
    @Profile("docker")
    public CommandLineRunner initData() {
        return args -> {
            // Chỉ thêm dữ liệu nếu chưa có
            if (userRepository.count() == 0) {
                // Thêm users
                User user1 = new User();
                user1.setFullName("Nguyễn Văn A");
                user1.setPhoneNumber("0912345678");
                user1.setEmail("nguyenvana@gmail.com");
                user1.setPassword("123");
                user1.setAddress("123 Đường Ba Trạc, Quận 8, TP.HCM");
                user1.setUserType("CUSTOMER");
                user1.setStatus("ACTIVE");

                User user2 = new User();
                user2.setFullName("Trần Thị Bích");
                user2.setPhoneNumber("0987654321");
                user2.setEmail("tranthib@gmail.com");
                user2.setPassword("123");
                user2.setAddress("456 Lê Lợi, Quận 1, TP.HCM");
                user2.setUserType("CUSTOMER");
                user2.setStatus("ACTIVE");

                User user3 = new User();
                user3.setFullName("Lê Văn Cường");
                user3.setPhoneNumber("0909123456");
                user3.setEmail("levanc@gmail.com");
                user3.setPassword("123");
                user3.setAddress("789 Nguyễn Trãi, Quận 5, TP.HCM");
                user3.setUserType("CUSTOMER");
                user3.setStatus("ACTIVE");

                User user4 = new User();
                user4.setFullName("Phạm Thị Dung");
                user4.setPhoneNumber("0932123456");
                user4.setEmail("phamthid@gmail.com");
                user4.setPassword("123");
                user4.setAddress("101 Võ Văn Tần, Quận 3, TP.HCM");
                user4.setUserType("CUSTOMER");
                user4.setStatus("ACTIVE");

                User user5 = new User();
                user5.setFullName("Hoàng Văn Em");
                user5.setPhoneNumber("0978123456");
                user5.setEmail("hoangvane@gmail.com");
                user5.setPassword("123");
                user5.setAddress("202 Trần Hưng Đạo, Quận 1, TP.HCM");
                user5.setUserType("CUSTOMER");
                user5.setStatus("ACTIVE");

                User user6 = new User();
                user6.setFullName("Võ Thị Fương");
                user6.setPhoneNumber("0922345678");
                user6.setEmail("vothif@gmail.com");
                user6.setPassword("123");
                user6.setAddress("303 Lý Thường Kiệt, Quận 10, TP.HCM");
                user6.setUserType("CUSTOMER");
                user6.setStatus("ACTIVE");

                User user7 = new User();
                user7.setFullName("Bùi Văn Giang");
                user7.setPhoneNumber("0945678901");
                user7.setEmail("buivang@gmail.com");
                user7.setPassword("123");
                user7.setAddress("404 Hai Bà Trưng, Quận 1, TP.HCM");
                user7.setUserType("CUSTOMER");
                user7.setStatus("ACTIVE");

                User user8 = new User();
                user8.setFullName("Ngô Thị Hạnh");
                user8.setPhoneNumber("0967890123");
                user8.setEmail("ngothih@gmail.com");
                user8.setPassword("123");
                user8.setAddress("505 Cách Mạng Tháng 8, Quận 3, TP.HCM");
                user8.setUserType("CUSTOMER");
                user8.setStatus("ACTIVE");

                User user9 = new User();
                user9.setFullName("Đặng Văn Ích");
                user9.setPhoneNumber("0918901234");
                user9.setEmail("dangvani@gmail.com");
                user9.setPassword("123");
                user9.setAddress("606 Nguyễn Thị Minh Khai, Quận 3, TP.HCM");
                user9.setUserType("CUSTOMER");
                user9.setStatus("ACTIVE");

                User user10 = new User();
                user10.setFullName("Lý Thị Kiều");
                user10.setPhoneNumber("0989012345");
                user10.setEmail("lythik@gmail.com");
                user10.setPassword("123");
                user10.setAddress("707 Lê Hồng Phong, Quận 10, TP.HCM");
                user10.setUserType("EMPLOYEE");
                user10.setStatus("ACTIVE");

                User user11 = new User();
                user11.setFullName("admin");
                user11.setPhoneNumber("0324564621");
                user11.setEmail("admin@gmail.com");
                user11.setPassword("123");
                user11.setAddress("707 Lê Hồng Phong, Quận 10, TP.HCM");
                user11.setUserType("EMPLOYEE");
                user11.setStatus("ACTIVE");

                userRepository.saveAll(java.util.Arrays.asList(user1, user2, user3, user4, user5, user6, user7, user8,
                        user9, user10, user11));

                // Thêm customers
                for (long i = 1; i <= 9; i++) {
                    Customer customer = new Customer();
                    customer.setId(i);
                    customer.setUser(userRepository.findById(i).get());
                    customerRepository.save(customer);
                }

                // Thêm employees
                Employee employee1 = new Employee();
                employee1.setId(10L);
                employee1.setPosition("Nhân viên");
                employee1.setUser(userRepository.findById(10L).get());
                employeeRepository.save(employee1);

                Employee employee2 = new Employee();
                employee2.setId(11L);
                employee2.setPosition("Quản lí");
                employee2.setUser(userRepository.findById(11L).get());
                employeeRepository.save(employee2);
            }
        };
    }
}