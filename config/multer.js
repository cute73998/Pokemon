// config/multer.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đảm bảo thư mục lưu trữ tồn tại
const uploadDir = path.join(__dirname, '..', 'public', 'images', 'avatars');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Lưu file vào thư mục public/static/images/avatars
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Tên file: userId-timestamp.ext
        const userId = req.session.user ? req.session.user.id : 'temp';
        const ext = path.extname(file.originalname);
        cb(null, `user-${userId}-${Date.now()}${ext}`);
    }
});

// Chỉ cho phép upload file ảnh
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const mimeType = allowedTypes.test(file.mimetype);
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

        if (mimeType && extname) {
            return cb(null, true);
        }
        cb(new Error('Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif)!'));
    }
});

module.exports = upload;