# Database Assignment 2 - Setup Guide

Hướng dẫn cài đặt và chạy dự án Database Assignment 2 với SQL Server, Backend (Node.js/Express), và Frontend (Vue.js).

## Yêu Cầu Hệ Thống

- **Docker Desktop** - Để chạy SQL Server container
- **Node.js** (phiên bản 14 trở lên) và **npm**
- **VS Code** với extension **SQL Server (mssql)** đã cài đặt

## Bước 1: Khởi Động SQL Server Container

### 1.1. Khởi động Docker Desktop
Mở Docker Desktop và đảm bảo Docker đang chạy.

### 1.2. Chạy SQL Server Container
```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd" -p 1433:1433 --name sql1 --hostname sql1 --platform linux/amd64 -d mcr.microsoft.com/mssql/server:2022-latest
```

### 1.3. Kiểm tra Container đang chạy
```bash
docker ps
```

Bạn sẽ thấy container `sql1` đang chạy với status `Up`.

## Bước 2: Kết Nối và Thiết Lập Database

### 2.1. Kết nối với SQL Server trong VS Code

1. Mở VS Code và click vào biểu tượng **SQL Server** ở thanh bên trái
2. Click vào dấu **+** để thêm kết nối mới
3. Nhập thông tin kết nối:
   - **Server name:** `localhost`
   - **Database name:** `master` (hoặc để trống)
   - **Authentication Type:** `SQL Login`
   - **User name:** `sa`
   - **Password:** `YourStrong@Passw0rd`
   - **Profile Name:** `sql1`
   - **Save Password:** Yes

### 2.2. Chạy các Script SQL theo thứ tự

Sau khi kết nối thành công, chạy các file SQL trong thư mục `sql-server-assignment` theo đúng thứ tự sau:

#### Bước 1: Tạo Tables
```bash
# Mở file create_table.sql
# Right-click trong editor → Execute Query
# Hoặc nhấn Cmd+Shift+E (Mac) / Ctrl+Shift+E (Windows)
```
File: `sql-server-assignment/create_table.sql`

#### Bước 2: Tạo Functions và Procedures
```bash
# Mở file function_procedure.sql
# Execute Query
```
File: `sql-server-assignment/function_procedure.sql`

#### Bước 3: Tạo Triggers
```bash
# Mở file trigger.sql
# Execute Query
```
File: `sql-server-assignment/trigger.sql`

#### Bước 4: Insert Data
```bash
# Mở file insert_data.sql
# Execute Query
```
File: `sql-server-assignment/insert_data.sql`

**Lưu ý:** Phải chạy đúng thứ tự các file trên để đảm bảo database được khởi tạo đúng cách.

## Bước 3: Thiết Lập Backend

### 3.1. Di chuyển vào thư mục backend
```bash
cd backend
```

### 3.2. Cài đặt dependencies
```bash
npm install
```

Các package sẽ được cài đặt:
- `express` - Web framework
- `mssql` - SQL Server driver
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Environment variables
- `body-parser` - Parse request bodies
- `nodemon` (dev) - Auto-restart server

### 3.3. Kiểm tra file .env

Đảm bảo file `backend/.env` có nội dung:
```env
# Database Configuration
DB_SERVER=localhost
DB_USER=sa
DB_PASSWORD=YourStrong@Passw0rd
DB_NAME=master

# Server Configuration
PORT=3000
```

**Lưu ý:** Nếu bạn đã tạo database riêng trong `create_table.sql`, hãy thay đổi `DB_NAME` cho phù hợp.

### 3.4. Chạy Backend Server

**Development mode (với auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Backend sẽ chạy tại: `http://localhost:3000`

## Bước 4: Thiết Lập Frontend

### 4.1. Mở terminal mới và di chuyển vào thư mục frontend
```bash
cd frontend-app
```

### 4.2. Cài đặt dependencies
```bash
npm install
```

Các package sẽ được cài đặt:
- `vue` - Vue.js framework
- `vue-router` - Vue routing
- `axios` - HTTP client
- `bootstrap` - CSS framework
- `bootstrap-icons` - Icon library
- `vite` (dev) - Build tool

### 4.3. Chạy Frontend Development Server
```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173` (hoặc port khác nếu 5173 đã được sử dụng)

Vite sẽ tự động mở trình duyệt.

## Bước 5: Kiểm Tra Ứng Dụng

1. **Backend:** Truy cập `http://localhost:3000` - Server đang chạy
2. **Frontend:** Truy cập `http://localhost:5173` - Giao diện web
3. **Database:** Sử dụng SQL Server extension trong VS Code để query database

## Tóm Tắt Các Lệnh Chạy

### Chạy tất cả trong các terminal riêng biệt:

**Terminal 1 - SQL Server (Docker):**
```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd" -p 1433:1433 --name sql1 --hostname sql1 --platform linux/amd64 -d mcr.microsoft.com/mssql/server:2022-latest
```

**Terminal 2 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend-app
npm install
npm run dev
```

## Xử Lý Sự Cố

### Docker container đã tồn tại
Nếu gặp lỗi container name already in use:
```bash
docker rm sql1
# Sau đó chạy lại lệnh docker run
```

### Docker container bị dừng
Để khởi động lại container:
```bash
docker start sql1
```

### Không kết nối được database
1. Kiểm tra Docker container đang chạy: `docker ps`
2. Kiểm tra logs: `docker logs sql1`
3. Kiểm tra thông tin trong file `.env`
4. Đảm bảo port 1433 không bị chặn

### Backend không khởi động
1. Kiểm tra file `.env` có đúng thông tin
2. Đảm bảo database đã được setup (chạy các file SQL)
3. Kiểm tra port 3000 chưa được sử dụng bởi ứng dụng khác

### Frontend không khởi động
1. Kiểm tra `node_modules` đã được cài đặt
2. Xóa `node_modules` và chạy `npm install` lại
3. Kiểm tra port 5173 chưa được sử dụng

## Dừng Ứng Dụng

- **Frontend/Backend:** Nhấn `Ctrl+C` trong terminal
- **Docker Container:** 
  ```bash
  docker stop sql1
  ```

## Xóa Container (Nếu Cần)
```bash
docker stop sql1
docker rm sql1
```

---

## Cấu Trúc Thư Mục

```
Database_Assignment2/
├── backend/                # Node.js/Express backend
│   ├── config/
│   │   └── db.js          # Database configuration
│   ├── routes/            # API routes
│   │   ├── orders.js
│   │   ├── products.js
│   │   └── users.js
│   ├── .env               # Environment variables
│   ├── package.json
│   └── server.js          # Entry point
│
├── frontend-app/          # Vue.js frontend
│   ├── src/
│   │   ├── components/    # Vue components
│   │   ├── views/         # Page views
│   │   ├── router/        # Vue router
│   │   ├── services/      # API services
│   │   └── App.vue
│   ├── package.json
│   └── vite.config.js
│
├── sql-server-assignment/ # SQL Scripts
│   ├── create_table.sql       # Bước 1
│   ├── function_procedure.sql # Bước 2
│   ├── trigger.sql            # Bước 3
│   ├── insert_data.sql        # Bước 4
│   ├── test.sql
│   └── reset.sql
│
└── README.md             # File này
```

## Thông Tin Kết Nối Mặc Định

- **SQL Server:**
  - Host: `localhost`
  - Port: `1433`
  - User: `sa`
  - Password: `YourStrong@Passw0rd`

- **Backend API:**
  - URL: `http://localhost:3000`

- **Frontend:**
  - URL: `http://localhost:5173`

---

