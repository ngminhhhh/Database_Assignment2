# Database Assignment 2 - Docker Setup

Dự án E-Commerce với SQL Server, Backend (Node.js/Express), và Frontend (Vue.js) được containerized bằng Docker.

## Yêu Cầu Hệ Thống

- **Docker Desktop** - Phải đang chạy
- **Port yêu cầu**: 1433, 8080 (không bị sử dụng)

## Cách Chạy Dự Án

```bash
docker-compose up -d
```

## Truy Cập Ứng Dụng

- **Frontend (Giao diện web)**: http://localhost:8080
- **API (qua Frontend proxy)**: http://localhost:8080/api
- **SQL Server**: localhost:1433 (user: `sa`, password: `YourStrong@Passw0rd`)

**Lưu ý**: Backend API **KHÔNG** public trực tiếp. Tất cả API requests phải đi qua Frontend (Nginx proxy) tại `http://localhost:8080/api/*`

## Test Tài Khoản

### Admin Account
- Email: `smanager@example.com`
- Password: `admin123`
- Role: ADMIN

### User Accounts (không cần password)
- `alice.nguyen@example.com`
- `bob.tran@example.com`
- `carol.le@example.com`
- `david.pham@example.com`
- `eve.hoang@example.com`
- `frank.vo@example.com`

## Các Lệnh Hữu Ích

### Xem logs
```bash
# Tất cả services
docker-compose logs

# Chỉ backend
docker-compose logs backend

# Chỉ frontend
docker-compose logs frontend

# Chỉ database
docker-compose logs sqlserver

# Theo dõi realtime
docker-compose logs -f
```

### Dừng ứng dụng
```bash
docker-compose down
```

### Dừng và xóa dữ liệu database
```bash
docker-compose down -v
```

### Khởi động lại một service
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Rebuild sau khi thay đổi code
```bash
docker-compose up -d --build
```

### Kiểm tra trạng thái containers
```bash
docker-compose ps
```

## Test API

Tất cả API requests phải qua Frontend proxy:

### Get Products
```bash
curl http://localhost:8080/api/products
```

### Get Users
```bash
curl http://localhost:8080/api/users
```

### Get Orders
```bash
curl http://localhost:8080/api/orders
```

### Login Admin
```powershell
$body = @{email='smanager@example.com';password='admin123'} | ConvertTo-Json
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d $body
```

### Login User
```powershell
$body = @{email='alice.nguyen@example.com';password=''} | ConvertTo-Json
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d $body
```

### Create Product
```powershell
$body = @{seller_id='SEL0001';name='New Product';description='Test product';price=500000;stock_quantity=10} | ConvertTo-Json
curl -X POST http://localhost:8080/api/products -H "Content-Type: application/json" -d $body
```

## Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────┐
│  Browser (http://localhost:8080)                │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Frontend Container (Nginx)                     │
│  - Serve Vue.js static files                    │
│  - Proxy /api/* → backend:3000                  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Backend Container (Node.js/Express)            │
│  - Port: 3000 (internal only)                   │
│  - API endpoints: /api/*                        │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  SQL Server Container                           │
│  - Port: 1433 (exposed)                         │
│  - Database: MyDatabase                         │
└─────────────────────────────────────────────────┘
```

## Cấu Trúc Thư Mục

```
Database_Assignment2/
├── docker-compose.yml          # Cấu hình Docker services
├── backend/
│   ├── Dockerfile
│   ├── server.js
│   ├── config/
│   │   └── db.js              # SQL Server connection
│   └── routes/
│       ├── auth.js            # Login API
│       ├── products.js        # Products CRUD
│       ├── orders.js          # Orders API
│       └── users.js           # Users API
├── frontend-app/
│   ├── Dockerfile
│   ├── nginx.conf             # Nginx proxy config
│   └── src/
│       ├── views/
│       ├── components/
│       └── services/
│           └── api.js         # API client
└── sql-server-assignment/
    ├── create_table.sql       # Database schema
    ├── function_procedure.sql # Functions & Procedures
    ├── trigger.sql            # Triggers
    └── insert_data.sql        # Sample data
```

## Xử Lý Sự Cố

### Port đã được sử dụng
Kiểm tra và thay đổi port trong `docker-compose.yml`:
```yaml
ports:
  - "8081:80"  # Thay 8080 thành 8081
```

### Database chưa được khởi tạo
Xem logs của db-init container:
```bash
docker-compose logs db-init
```

Nếu cần chạy lại:
```bash
docker-compose down -v
docker-compose up -d
```

### Frontend không gọi được API
Kiểm tra logs:
```bash
docker-compose logs frontend
docker-compose logs backend
```

### Rebuild toàn bộ từ đầu
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## Tính Năng Bảo Mật

- ✅ Backend **KHÔNG** public ra ngoài
- ✅ Tất cả API requests phải qua Nginx proxy
- ✅ CORS được cấu hình đúng
- ✅ SQL injection protection với parameterized queries
- ✅ Database credentials trong Docker environment variables

## Environment Variables

### Backend
- `DB_SERVER`: sqlserver
- `DB_USER`: sa
- `DB_PASSWORD`: YourStrong@Passw0rd
- `DB_NAME`: MyDatabase
- `PORT`: 3000

### Frontend
- `VITE_API_BASE_URL`: /api (relative path qua proxy)

---

**Phát triển bởi**: Database Assignment 2 Team
**Ngày**: December 2025

