# Stage 1: Build the React application
FROM node:18-alpine AS build-stage

# Đặt thư mục làm việc bên trong container
WORKDIR /app

# Sao chép package.json và package-lock.json (hoặc yarn.lock)
# Các file này nằm ở gốc của build context (tức là thư mục frontend)
COPY package.json package-lock.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn còn lại của ứng dụng từ build context (thư mục frontend)
# vào thư mục /app bên trong container
COPY . .

# Build ứng dụng React
# Hãy kiểm tra lại script build trong file package.json của bạn (thường là "build")
RUN npm run build

# Stage 2: Serve ứng dụng bằng Nginx
FROM nginx:stable-alpine AS production-stage

# Sao chép kết quả build từ build-stage (thư mục /app/build)
# vào thư mục phục vụ web mặc định của Nginx
COPY --from=build-stage /app/build /usr/share/nginx/html

# (Tùy chọn) Nếu bạn có file cấu hình Nginx tùy chỉnh (ví dụ: nginx.conf)
# đặt nó cùng cấp với Dockerfile này và bỏ comment dòng dưới để sao chép
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Mở cổng 80
EXPOSE 80

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]