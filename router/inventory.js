const express = require('express');
const controller = require('../controller/pokeController');
const queries = require('../db/queries');
const app = express.Router();

// THÊM: Import Multer, fs và path
const upload = require('../config/multer');
const fs = require('fs');
const path = require('path');

const pool = require('../db/pool');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('login', { errors: [] });
});

app.get('/register', (req, res) => {
    res.render('register', { errors: [], success: false });
})

app.post('/register', controller.registerPost);

app.get('/random-pokemon', async (req, res) => {
    // THÊM: Kiểm tra đăng nhập và lấy userId
    if (!req.session.user || !req.session.user.id) {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
    const userId = req.session.user.id; // <--- ĐỊNH NGHĨA userId Ở ĐÂY!
    // END THÊM
    const pokemon = await controller.randomPokemon(req);
    // Xử lý cooldown
    if (pokemon === null) {
        const COLLLDOWN_TIME = 5 * 60 * 1000; // 5 minutes
        const lastRandomTime = await queries.getLastRandomTime(userId) || 0; // Lấy thời gian từ DB
        const remainingTime = COLLLDOWN_TIME - (Date.now() - lastRandomTime);
        // Tính thời gian còn lại
        return res.status(429).json({
            remainingTime: remainingTime
        })
    }
    res.json(pokemon);
})

app.get('/last-pokemon', async (req, res) => {
    if (!req.session.user || !req.session.user.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = req.session.user.id;
    const lastPokemon = await queries.getLastPokemon(userId);
    res.json(lastPokemon)
})

app.get('/homepage', (req, res) => {
    const success_catch = req.session.success_catch || [];
    const error_catch = req.session.error_catch || [];

    delete req.session.success_catch;
    delete req.session.error_catch;
    res.render('homepage', {
        success_catch: success_catch,
        error_catch: error_catch
    });
})

app.get('/inventory', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/pokemon');
    }

    const userPokemons = await queries.getUserPokemons(req.session.user.id);

    res.render('inventory', {
        userPokemons,
        user: req.session.user
    })
})

app.get('/catch', async (req, res) => {
    if (!req.session.user || !req.session.user.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const result = await controller.catchPokemon(req.session.user);
    if (result.success) {
        req.session.success_catch = result.success;
    } else if (result.error) {
        req.session.error_catch = result.error;
    }
    res.redirect('/pokemon/homepage');

})


app.post('/', controller.loginPost);

app.get('/information', async (req, res) => {
    // 1. Kiểm tra trạng thái đăng nhập
    if (!req.session.user || !req.session.user.id) {
        return res.redirect('/pokemon'); // Chuyển hướng về trang đăng nhập
    }

    try {
        const userId = req.session.user.id;

        // 2. Lấy thông tin người dùng hiện tại từ Database
        // Hàm queries.getUserInfo đã được sửa để lấy id, username, name, và password
        const result = await queries.getUserInfo(userId);

        if (result.length === 0) {
            // Nếu không tìm thấy user, hủy session và chuyển hướng
            req.session.destroy();
            return res.redirect('/pokemon');
        }

        const user = result[0];

        // 3. Render trang information.ejs
        res.render('information', {
            user: user, // Truyền dữ liệu để điền vào form
            // Truyền thông báo (nếu có, ví dụ: sau khi cập nhật thành công/lỗi)
            message: req.session.message || null,
            isLoggedIn: true // Cho thanh navbar
        });

        // Xóa thông báo sau khi đã hiển thị
        req.session.message = null;

    } catch (error) {
        console.error('Lỗi khi tải thông tin người dùng:', error);
        res.status(500).send('Lỗi máy chủ khi tải thông tin.');
    }
});

// === ROUTER: Trang Thông tin Cá nhân (POST - Cập nhật) ===
app.post('/information', upload.single('avatar'), async (req, res) => {
    if (!req.session.user || !req.session.user.id) {
        // THÊM: Nếu không đăng nhập mà upload file thì phải xóa file
        if (req.file) { fs.unlinkSync(req.file.path); }
        return res.redirect('/pokemon');
    }

    const userId = req.session.user.id;
    // Bỏ trim() cho new_password, confirm_password vì để trống là không cập nhật
    const { name, new_password, confirm_password, current_password } = req.body;

    // Biến trạng thái cập nhật
    let updateName = name !== req.session.user.name;
    let updatePassword = new_password && new_password.trim() !== '';
    let updateAvatar = req.file !== undefined;

    const newAvatarPath = updateAvatar ? `/images/avatars/${path.basename(req.file.path)}` : null;

    // Nếu không có bất kỳ trường nào được cập nhật, quay lại
    if (!updateName && !updatePassword && !updateAvatar) {
        req.session.message = { type: 'warning', text: 'Không có thông tin nào được thay đổi.' };
        return res.redirect('/pokemon/information');
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Lấy thông tin người dùng hiện tại (cần mật khẩu và đường dẫn avatar cũ)
        const userInfoResult = await queries.getUserInfo(userId);
        const user = userInfoResult[0];
        const currentDbPassword = user.password;
        const currentAvatarPath = user.avatar;

        // 2. Xác minh Mật khẩu Hiện tại (BẮT BUỘC nếu có bất kỳ cập nhật nào)
        if (!current_password || current_password !== currentDbPassword) {
            // Xóa file nếu có upload
            if (req.file) { fs.unlinkSync(req.file.path); }
            req.session.message = { type: 'danger', text: 'Mật khẩu hiện tại không chính xác. Không thể lưu thay đổi.' };
            await client.query('ROLLBACK');
            return res.redirect('/pokemon/information');
        }

        let finalPassword = currentDbPassword; // Mặc định giữ nguyên mật khẩu cũ
        let messageText = 'Thông tin của bạn đã được cập nhật thành công: ';

        // 3. Xử lý logic cập nhật Mật khẩu nếu có
        if (updatePassword) {
            if (new_password.length < 6) {
                if (req.file) { fs.unlinkSync(req.file.path); }
                req.session.message = { type: 'danger', text: 'Mật khẩu mới phải có ít nhất 6 ký tự.' };
                await client.query('ROLLBACK');
                return res.redirect('/pokemon/information');
            }
            if (new_password !== confirm_password) {
                if (req.file) { fs.unlinkSync(req.file.path); }
                req.session.message = { type: 'danger', text: 'Mật khẩu mới và xác nhận mật khẩu không khớp.' };
                await client.query('ROLLBACK');
                return res.redirect('/pokemon/information');
            }
            finalPassword = new_password; // Lưu mật khẩu mới (plain text)
            messageText += 'Mật khẩu, ';
        }

        if (updateName) {
            messageText += 'Tên hiển thị, ';
        }

        if (updateAvatar) {
            messageText += 'Ảnh đại diện, ';
        }

        // 4. Cập nhật DB (Sử dụng hàm updateUserInfo mới)
        await queries.updateUserInfo(
            name,
            finalPassword,
            newAvatarPath,
            userId,
            updateName, // true nếu tên thay đổi
            updatePassword, // true nếu mật khẩu thay đổi
            updateAvatar // true nếu ảnh thay đổi
        );

        // 5. THÊM: Xóa ảnh cũ trên Server (CHỈ XÓA KHI CÓ ẢNH MỚI & ẢNH CŨ KHÔNG PHẢI MẶC ĐỊNH)
        if (updateAvatar && currentAvatarPath && currentAvatarPath !== '/images/default_avatar.png') {
            const oldFilePath = path.join(__dirname, '..', 'public', currentAvatarPath);

            if (fs.existsSync(oldFilePath)) {
                fs.unlink(oldFilePath, (err) => {
                    if (err) console.error('Lỗi khi xóa ảnh đại diện cũ:', err);
                });
            }
        }

        // 6. Cập nhật Session
        if (updateName) {
            req.session.user.name = name;
        }
        if (updateAvatar) {
            req.session.user.avatar = newAvatarPath;
        }
        // Không cần cập nhật mật khẩu trong session nếu không muốn lưu plain text

        // Xóa dấu phẩy và khoảng trắng cuối cùng
        messageText = messageText.slice(0, -2) + '.';
        req.session.message = { type: 'success', text: messageText };

        await client.query('COMMIT');
        res.redirect('/pokemon/information');

    } catch (error) {
        await client.query('ROLLBACK');
        // Xóa file mới nếu xảy ra lỗi DB (transaction rollback)
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Lỗi khi cập nhật thông tin người dùng:', error);
        req.session.message = { type: 'danger', text: 'Đã xảy ra lỗi hệ thống khi cập nhật thông tin.' };
        res.redirect('/pokemon/information');
    } finally {
        client.release();
    }
});


// THÊM: ROUTER CHO TỪ ĐIỂN POKÉMON (/pokemon/dictionary)
app.get('/dictionary', async (req, res) => {
    // 1. Kiểm tra đăng nhập
    if (!req.session.user) {
        return res.redirect('/pokemon');
    }

    try {
        // 2. Lấy toàn bộ Pokémon từ DB
        const allPokemons = await queries.getAllPokemon(); // Hàm này đã có sẵn trong queries.js

        // 3. Render trang dictionary.ejs (sẽ tạo ở bước 3)
        res.render('dictionary', {
            allPokemons: allPokemons,
            user: req.session.user, // Truyền user cho navbar
            isLoggedIn: true
        });

    } catch (error) {
        console.error('Lỗi khi tải từ điển Pokémon:', error);
        res.status(500).send('Lỗi máy chủ khi tải dữ liệu Pokémon.');
    }
});

module.exports = app;