npm init

Cài đặt các package
npm install body-parser@1.19.0 dotenv@8.2.0 ejs@3.1.5 express@4.17.1
Description package:
    body-parser: dùng để viết api, truyền dữ liệu từ client lên server
    dotenv: giúp lấy các tham số chúng ta khai báo trong môi trường
    ejs: 
    express: siêu nhân chạy dự án :)))

npm install --save-dev @babel/core@7.12.10 @babel/node@7.12.10 @babel/preset-env@7.12.10 nodemon@2.0.7
babel là trình dịch về chuẩn của javascript 

Cấu trúc thư mục (tùy ý) này dựa theo cấu trúc của laravel mvc
src
    config: dùng làm việc với database
    controller: 
    public: dùng để lưu các assets
    views:
    route: dùng để viết đường dẫn (path)

Cấu hình các tham số môi trường
 tạo .env và .env.example, file env.example dùng để đẩy lên github 2 file điều giống nhau 
 tạo .gitignore dùng để muốn đẩy file nào lên github
 tạo .babelrc dùng để cấu hình trình compli gì đó 
        {
            "presets": ["@babel/preset-env"]
        } phía sau màn ảnh chỉ là cấu hình, để làm cho thư viện hoạt động

Đầu tiên cấu hình file config

    import express from "express";
     let configViewEngine = (app) =>{
        app.use(express.static("./src/public")) //Sau này lấy ảnh trên server chỉ được lấy trong thư mục public
        app.set("View engine", "ejs")// cho phép viết logic trong html
        app.set("views", ./src/views") // bắt buộc phải tạo view trong thư mục view, tìm các file ejs trong thư mục view
     }

APIs là gì
 API là cầu nối giữa back-end và front-end, back-end sẽ làm việc với database còn fron-end sẽ render ra giao diện người dùng, nôm na là đường link

 APIs sẽ trả về 1 object dưới dạng json
