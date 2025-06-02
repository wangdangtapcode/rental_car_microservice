
-- Rental Contract for Toyota Innova (800,000 * 3)
INSERT INTO rental_contracts (id, created_date, deposit_amount, due_amount, total_estimated_amount, status, customer_id, employee_id)
VALUES (1,'2025-05-09', 480000.0, 1920000.0, 2400000.0, 'BOOKING', 1, null);

-- Rental Contract for Honda CR-V (1,000,000 * 3)
INSERT INTO rental_contracts (id, created_date, deposit_amount, due_amount, total_estimated_amount, status, customer_id, employee_id)
VALUES (2,'2025-05-09', 600000.0, 2400000.0, 3000000.0, 'BOOKING', 2, null);

-- Rental Contract for Hyundai Accent (600,000 * 3)
INSERT INTO rental_contracts (id, created_date, deposit_amount, due_amount, total_estimated_amount, status, customer_id, employee_id)
VALUES (3,'2025-05-09', 360000.0, 1440000.0, 1800000.0, 'BOOKING', 3, null);

INSERT INTO rental_contracts (id, created_date, deposit_amount, due_amount, total_estimated_amount, status, customer_id, employee_id)
VALUES (4,'2025-05-09', 840000.0, 3360000.0, 4200000.0, 'ACTIVE', 4, 11);

-- Rental Contract for Honda CR-V (1,000,000 * 3)
INSERT INTO rental_contracts (id, created_date, deposit_amount, due_amount, total_estimated_amount, status, customer_id, employee_id)
VALUES (5,'2025-05-09', 600000.0, 2400000.0, 3000000.0, 'ACTIVE', 5, 11);


-- Insert into contract_vehicle_details
INSERT INTO contract_vehicle_details (id, rental_price, start_date, end_date, total_estimated_amount,condition_notes, status, vehicle_id, rental_contract_id)
VALUES
(1, 800000.0, '2025-05-09', '2025-05-11', 2400000.0,null, 'BOOKING', 1, 1),
(2, 1000000.0, '2025-05-09', '2025-05-11', 3000000.0,null, 'BOOKING', 2, 2),
(3, 600000.0, '2025-05-09', '2025-05-11', 1800000.0,null, 'BOOKING', 3, 3),
(4, 900000.0, '2025-05-09', '2025-05-10', 1800000.0, 'EXCELLENT','ACTIVE', 4, 4),
(5, 1200000.0, '2025-05-09', '2025-05-10', 2400000.0,'GOOD', 'ACTIVE', 5, 4),
(6, 950000.0, '2025-05-09', '2025-05-10', 1900000.0,'EXCELLENT', 'ACTIVE', 6, 5),
(7, 550000.0, '2025-05-09', '2025-05-10', 1100000.0,'GOOD', 'ACTIVE', 7, 5);

-- Insert into penalty_types
INSERT INTO penalty_rules (id, name, default_amount, description)
VALUES
(1, 'Vi phạm giao thông', 500000.0, 'Phạt do vi phạm luật giao thông'),
(2, 'Hư hỏng xe', 1000000.0, 'Phạt do làm hư hỏng xe'),
(3, 'Trễ hạn trả xe', 200000.0, 'Phạt do trả xe muộn'),
(4, 'Không đổ đầy xăng khi trả xe', 300000.0, 'Phạt do không đổ đầy bình xăng khi hoàn trả xe'),
(5, 'Làm mất giấy tờ xe', 800000.0, 'Phạt do làm mất giấy đăng ký xe hoặc bảo hiểm xe'),
(6, 'Làm mất phụ kiện đi kèm', 200000.0, 'Phạt do làm mất phụ kiện như dây sạc, đồ cứu hộ, thảm sàn'),
(7, 'Không vệ sinh xe khi trả', 100000.0, 'Phạt do không vệ sinh sạch sẽ xe khi hoàn trả'),
(8, 'Lái xe ngoài khu vực cho phép', 600000.0, 'Phạt do đưa xe ra ngoài khu vực đã cam kết'),
(9, 'Chở quá số người quy định', 400000.0, 'Phạt do chở quá số lượng hành khách cho phép theo thiết kế xe');
-- Insert into penalties
-- INSERT INTO penalties (id, penalty_amount, note, contract_vehicle_detail_id, penalty_type_id)
-- VALUES
-- (1, 500000.0, 'Chạy quá tốc độ', 1, 1),
-- (2, 1000000.0, 'Vỡ gương chiếu hậu', 2, 2),
-- (3, 200000.0, 'Trả xe muộn 1 ngày', 3, 3);

-- Insert into collaterals
INSERT INTO collaterals (id, description, rental_contract_id)
VALUES
(1, 'CMND bản sao', 1),
(2, 'Hộ khẩu bản sao', 2),
(3, 'Sổ hồng bản sao', 3),
(4, 'Hộ khẩu bản sao',4),
(5, 'CMND bản sao', 4),
(6, 'CMND bản sao', 5),
(7, 'Hộ khẩu bản sao',5);