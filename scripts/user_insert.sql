


-- Thêm dữ liệu vào bảng users (người dùng)
INSERT INTO users (id, full_name, phone_number, email, password, address, user_type, status)
VALUES
(1, 'Nguyễn Văn A', '0912345678', 'nguyenvana@gmail.com', '123', '123 Đường Ba Trạc, Quận 8, TP.HCM', 'CUSTOMER', 'ACTIVE'),
(2, 'Trần Thị Bích', '0987654321', 'tranthib@gmail.com', '123', '456 Lê Lợi, Quận 1, TP.HCM', 'CUSTOMER', 'ACTIVE'),
(3, 'Lê Văn Cường', '0909123456', 'levanc@gmail.com', '123', '789 Nguyễn Trãi, Quận 5, TP.HCM', 'CUSTOMER', 'ACTIVE'),
(4, 'Phạm Thị Dung', '0932123456', 'phamthid@gmail.com', '123', '101 Võ Văn Tần, Quận 3, TP.HCM', 'CUSTOMER', 'ACTIVE'),
(5, 'Hoàng Văn Em', '0978123456', 'hoangvane@gmail.com', '123', '202 Trần Hưng Đạo, Quận 1, TP.HCM', 'CUSTOMER', 'ACTIVE'),
(6, 'Võ Thị Fương', '0922345678', 'vothif@gmail.com', '123', '303 Lý Thường Kiệt, Quận 10, TP.HCM', 'CUSTOMER', 'ACTIVE'),
(7, 'Bùi Văn Giang', '0945678901', 'buivang@gmail.com', '123', '404 Hai Bà Trưng, Quận 1, TP.HCM', 'CUSTOMER', 'ACTIVE'),
(8, 'Ngô Thị Hạnh', '0967890123', 'ngothih@gmail.com', '123', '505 Cách Mạng Tháng 8, Quận 3, TP.HCM', 'CUSTOMER', 'ACTIVE'),
(9, 'Đặng Văn Ích', '0918901234', 'dangvani@gmail.com', '123', '606 Nguyễn Thị Minh Khai, Quận 3, TP.HCM', 'CUSTOMER', 'ACTIVE'),
(10, 'Lý Thị Kiều', '0989012345', 'lythik@gmail.com', '123', '707 Lê Hồng Phong, Quận 10, TP.HCM', 'EMPLOYEE', 'ACTIVE'),
(11, 'admin', '0324564621', 'admin@gmail.com', '123', '707 Lê Hồng Phong, Quận 10, TP.HCM', 'EMPLOYEE', 'ACTIVE');
-- Insert into customers
INSERT INTO customers ( id)
VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9);
-- Thêm dữ liệu vào bảng employees (nhân viên)
INSERT INTO employees (id, position)
VALUES
(10, 'Nhân viên'),
(11, 'Quản lí');