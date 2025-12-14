const queries = require('../db/queries');

const { body, validationResult, matchedData, query } = require('express-validator');

const login = [
    body('username').trim()
        .notEmpty().withMessage('Username cannot be empty'),
    body('password').trim()
        .notEmpty().withMessage('Password cannot be empty')
]

const register = [
    body('username').trim()
        .notEmpty().withMessage('Username cannot be empty'),
    body('password').trim()
        .notEmpty().withMessage('Password cannot be empty')
        .matches(/\d/).withMessage('Password must contain a number')
        .matches(/[a-zA-Z]/).withMessage('Password must contain a letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain a special character'),
    body('confirmPassword').trim()
        .notEmpty().withMessage('Confirm password cannot be empty')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    body('name').trim()
        .notEmpty().withMessage('Name cannot be empty!')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long')
]


exports.loginPost = [
    login,
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).render(
                "login", {
                errors: error.array()
            }
            )
        }
        const { username, password } = matchedData(req);
        const account = await queries.loginAccount(username, password);
        if (account != null) {
            // LƯU TRẠNG THÁI ĐĂNG NHẬP VÀO SESSION
            req.session.user = account;
            res.redirect('/pokemon/homepage');
        }
        else {
            res.render('login', {
                errors: false
            })
        }
    }
]
exports.registerPost = [
    register,
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).render(
                "register", {
                errors: error.array()
            }
            )
        }
        const { username, password, name } = matchedData(req);
        // Kiểm tra xem username đã tồn tại chưa
        const isUsername = await queries.existingUsername(username);
        if (isUsername) {
            return res.status(400).render(
                'register', {
                errors: [{ msg: 'Username already exists! Try another one.' }]
            }
            )
        }
        else {
            // Thêm tài khoản mới vào database
            const check = await queries.registerAccount(username, password, name);
            if (!check) {
                return res.status(400).render(
                    'register', {
                    errors: [{ msg: 'Register fail!' }]
                })
            }
            else {
                return res.render('register', {
                    errors: [],
                    success: true
                })
            }
        }
    }
]

exports.catchPokemon = async function (user) {

    const lastPokemon = await queries.getLastPokemon(user.id);
    if (!lastPokemon) {
        return { error: ['No Pokémon available to catch.'] };
    }
    const max = await queries.getMaxCatchRate();
    const random_catch_rate = Math.random() * max;

    if (random_catch_rate <= lastPokemon.catch_rate) {
        await queries.addPokemonToInventory(user.id, lastPokemon.id);
        console.log(`Successfully caught ${lastPokemon.name}.`);
        console.log(`Tỷ lệ bắt random ${random_catch_rate}.`);
        console.log(`Tỷ lệ bắt của pokemon ${lastPokemon.catch_rate}.`);
        return { success: [`Successfully caught ${lastPokemon.name}.`] };
    }
    else {
        console.log(`Failed to catch the ${lastPokemon.name}.`)
        console.log(`Tỷ lệ bắt random ${random_catch_rate}.`);
        console.log(`Tỷ lệ bắt của pokemon ${lastPokemon.catch_rate}.`);
        return { error: [`Failed to catch the ${lastPokemon.name}.`] };
    }
}

exports.randomPokemon = async function (req) {
    if (!req.session.user || !req.session.user.id) {
        return { error: 'Unauthorized' }; // Trả về đối tượng lỗi để Server xử lý 401/404
    }
    const COLLLDOWN_TIME = 5 * 60 * 1000;// 5 minutes
    const userId = req.session.user.id;
    const lastRandomTime = await queries.getLastRandomTime(userId) || 0;
    const currentTime = Date.now();

    if (currentTime - lastRandomTime < COLLLDOWN_TIME) {
        // Trả về null nếu chưa đủ thời gian chờ
        return null
    }

    const pokemons = await queries.getAllPokemon();
    const total = pokemons.reduce((sum, pokemon) => sum + Number(pokemon.spawn_rate), 0);
    let r = Math.random() * total;

    for (const s of pokemons) {
        r -= s.spawn_rate;
        if (r <= 0) {
            console.log('r: ' + r);
            console.log('total: ' + total);
            // Cập nhật thời gian lần cuối lấy Pokémon ngẫu nhiên
            await queries.updateLastRandomTime(userId, currentTime);
            await queries.updateLastPokemon(userId, s);
            return s;
        }
    }
    throw new Error("Roll failed: No pokemon selected after loop completion.");
}