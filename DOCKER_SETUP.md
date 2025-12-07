# Database Assignment 2 - Docker Setup

## Cách Chạy Dự Án với Docker

### Yêu Cầu
- Docker Desktop đã cài đặt và đang chạy
- Docker Compose (đi kèm với Docker Desktop)

### Chạy Toàn Bộ Dự Án

1. **Build và khởi động tất cả services:**
```bash
docker-compose up --build
```

2. **Chạy ở chế độ background (detached):**
```bash
docker-compose up -d --build
```

3. **Khởi tạo Database (sau khi containers đã chạy):**

Sau khi SQL Server container đã sẵn sàng, bạn cần chạy các script SQL để tạo tables, functions, procedures, triggers và insert data:

**Cách 1: Sử dụng VS Code SQL Server Extension**
- Kết nối tới `localhost:1433` với user `sa` và password `YourStrong@Passw0rd`
- Chạy các file SQL theo thứ tự:
  1. `sql-server-assignment/create_table.sql`
  2. `sql-server-assignment/function_procedure.sql`
  3. `sql-server-assignment/trigger.sql`
  4. `sql-server-assignment/insert_data.sql`

**Cách 2: Sử dụng Docker exec**
```bash
# Copy scripts vào container
docker cp sql-server-assignment/create_table.sql database_assignment_sqlserver:/tmp/
docker cp sql-server-assignment/function_procedure.sql database_assignment_sqlserver:/tmp/
docker cp sql-server-assignment/trigger.sql database_assignment_sqlserver:/tmp/
docker cp sql-server-assignment/insert_data.sql database_assignment_sqlserver:/tmp/

# Chạy các scripts
docker exec -it database_assignment_sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -i /tmp/create_table.sql
docker exec -it database_assignment_sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -i /tmp/function_procedure.sql
docker exec -it database_assignment_sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -i /tmp/trigger.sql
docker exec -it database_assignment_sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -i /tmp/insert_data.sql
```

### Truy Cập Ứng Dụng

Sau khi chạy `docker-compose up`, các services sẽ có sẵn tại:

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **SQL Server**: localhost:1433

### Các Lệnh Docker Compose Hữu Ích

**Xem logs:**
```bash
# Xem tất cả logs
docker-compose logs

# Xem logs của một service cụ thể
docker-compose logs backend
docker-compose logs frontend
docker-compose logs sqlserver

# Theo dõi logs realtime
docker-compose logs -f
```

**Dừng các services:**
```bash
docker-compose down
```

**Dừng và xóa volumes (xóa dữ liệu database):**
```bash
docker-compose down -v
```

**Khởi động lại một service:**
```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart sqlserver
```

**Kiểm tra trạng thái:**
```bash
docker-compose ps
```

**Vào shell của một container:**
```bash
# Backend
docker exec -it database_assignment_backend sh

# Frontend
docker exec -it database_assignment_frontend sh

# SQL Server
docker exec -it database_assignment_sqlserver bash
```

### Cấu Trúc Docker

#### docker-compose.yml
Định nghĩa 3 services:
- **sqlserver**: SQL Server 2022 database
- **backend**: Node.js/Express API
- **frontend**: Vue.js app với Nginx

#### Backend Dockerfile
- Base image: `node:20-alpine`
- Chạy trên port 3000
- Production build với `npm ci`

#### Frontend Dockerfile
- Multi-stage build:
  - Stage 1: Build Vue.js app với Node
  - Stage 2: Serve với Nginx
- Chạy trên port 80 (mapped to 8080)

### Xử Lý Sự Cố

**Backend không kết nối được database:**
- Kiểm tra SQL Server container đã healthy: `docker-compose ps`
- Xem logs: `docker-compose logs sqlserver`
- Kiểm tra backend environment variables trong `docker-compose.yml`

**Frontend không gọi được API:**
- Kiểm tra `api.js` có đúng baseURL: `http://localhost:3000/api`
- Nếu chạy trong Docker network, có thể cần thay đổi thành `http://backend:3000/api`

**Port đã được sử dụng:**
Thay đổi port mapping trong `docker-compose.yml`:
```yaml
ports:
  - "8081:80"  # Thay 8080 thành 8081 cho frontend
  - "3001:3000"  # Thay 3000 thành 3001 cho backend
```

**Rebuild sau khi thay đổi code:**
```bash
docker-compose up --build
```

### Development Mode

Nếu muốn development với hot-reload, bạn có thể:

1. Chỉ chạy SQL Server trong Docker:
```bash
docker-compose up sqlserver
```

2. Chạy backend và frontend locally như hướng dẫn trong README.md chính

### Volumes

Database data được lưu trong Docker volume `sqlserver_data` để persist data giữa các lần khởi động container.

---

**Lưu ý**: Đảm bảo ports 1433, 3000, và 8080 không bị sử dụng bởi ứng dụng khác trước khi chạy docker-compose.
