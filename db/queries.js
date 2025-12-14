const pool = require('./pool');

async function loginAccount(username, password) {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    if (rows.length != 0) {
        return rows[0];
    }
    else {
        return null;
    }
}

async function existingUsername(username) {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (rows.length != 0) {
        return true;
    }
    else {
        return false;
    }
}

// queries.js (Sửa registerAccount)
async function registerAccount(username, password, name) {
    try {
        const result = await pool.query(
            'INSERT INTO users (username, password, name, level, exp, elo, base_atack, base_defend, avatar) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            // Truyền 8 giá trị
            [username, password, name, 1, 0, 1000, 10, 10, '/images/default_avatar.png']
        );
        return result.rowCount === 1;
    } catch (error) {
        console.error('Error registering account:', error);
        return false;
    }
}

async function getAllPokemon() {
    const { rows } = await pool.query('SELECT * FROM pokemons');
    return rows;
}

async function getLastRandomTime(userId) {
    const { rows } = await pool.query('SELECT last_random_time FROM users WHERE id = $1', [userId]);
    if (rows.length != 0) {
        return rows[0].last_random_time;
    }
    else {
        return null;
    }
}

async function getUserPokemons(userId) {
    const query = 'SELECT up.id AS inventory_id, up.nickname, up.caugth_at, p.id AS pokemon_id, p.name, p.level, p.catch_rate, p.atack, p.defend, p.describe, p.avatar, p.spawn_rate FROM user_pokemons up INNER JOIN pokemons p ON up.pokemon_id = p.id WHERE up.user_id = $1 ORDER BY up.caugth_at DESC';
    try {
        const { rows } = await pool.query(query, [userId]);
        return rows;
    }
    catch (err) {
        console.error('Error fetching user pokemons:', err);
        return [];
    }
}

async function getLastPokemon(userId) {
    const { rows } = await pool.query(`
        SELECT last_poke_name, last_poke_level, last_poke_catch_rate, 
               last_poke_describe, last_poke_atack, last_poke_defend, last_poke_avatar, last_poke_id
        FROM users WHERE id = $1`, [userId]);
    return rows.length > 0 ? {
        name: rows[0].last_poke_name,
        level: rows[0].last_poke_level,
        catch_rate: rows[0].last_poke_catch_rate,
        describe: rows[0].last_poke_describe,
        atack: rows[0].last_poke_atack,
        defend: rows[0].last_poke_defend,
        avatar: rows[0].last_poke_avatar,
        id: rows[0].last_poke_id
    } : null;
}

async function updateLastPokemon(userId, pokemon) {
    const { name, level, catch_rate, describe, atack, defend, avatar, id } = pokemon;
    const query = `
        UPDATE users SET 
            last_poke_name = $1, 
            last_poke_level = $2, 
            last_poke_catch_rate = $3, 
            last_poke_describe = $4, 
            last_poke_atack = $5, 
            last_poke_defend = $6, 
            last_poke_avatar = $7 ,
            last_poke_id = $8
        WHERE id = $9`;
    await pool.query(query, [name, level, catch_rate, describe, atack, defend, avatar, id, userId]);
}

async function updateLastRandomTime(userId, currentTime) {
    await pool.query('UPDATE users SET last_random_time = $1 WHERE id = $2', [currentTime, userId]);
}

async function getMaxCatchRate() {
    const { rows } = await pool.query('SELECT MAX(catch_rate) AS max_value FROM pokemons');
    return rows[0].max_value ?? 0;
}

async function addPokemonToInventory(userId, pokemonId) {
    try {
        const result = await pool.query('INSERT INTO user_pokemons (user_id, pokemon_id, nickname) VALUES ($1, $2, $3)', [userId, pokemonId, 'nickname']);
        return result.rowCount === 1;
    } catch (error) {
        console.error('Error registering account:', error);
        return false;
    }
}

// Hàm mới: Lấy thông tin người dùng (id, username, name, password)
async function getUserInfo(userId) {
    const { rows } = await pool.query(
        'SELECT id, username, name, password, level, exp, elo, base_atack, base_defend, avatar FROM users WHERE id = $1',
        [userId]
    );
    return rows;
}

// Hàm mới: Lấy chỉ mật khẩu (dùng để so sánh mật khẩu hiện tại)
async function getHashedPassword(userId) {
    const { rows } = await pool.query('SELECT password FROM users WHERE id = $1', [userId]);
    return rows;
}

// THÊM: Hàm mới: Cập nhật name, password, avatar
async function updateUserInfo(name, newPassword, avatarPath, userId, updateName = false, updatePassword = false, updateAvatar = false) {
    let queryParts = [];
    let params = [];
    let index = 1;

    // Chỉ thêm Name vào câu lệnh nếu cần cập nhật
    if (updateName) {
        queryParts.push(`name = $${index++}`);
        params.push(name);
    }

    // Chỉ thêm Password vào câu lệnh nếu cần cập nhật
    if (updatePassword) {
        queryParts.push(`password = $${index++}`);
        params.push(newPassword);
    }

    // Chỉ thêm Avatar vào câu lệnh nếu cần cập nhật
    if (updateAvatar) {
        queryParts.push(`avatar = $${index++}`);
        params.push(avatarPath);
    }

    // Nếu không có gì để cập nhật
    if (queryParts.length === 0) {
        return true;
    }

    // Tham số cuối cùng luôn là userId
    params.push(userId);

    const query = `UPDATE users SET ${queryParts.join(', ')} WHERE id = $${index}`;

    const result = await pool.query(query, params);
    return result.rowCount === 1;
}

module.exports = {
    loginAccount,
    getAllPokemon,
    existingUsername,
    registerAccount,
    getLastRandomTime,
    updateLastRandomTime,
    getLastPokemon,
    updateLastPokemon,
    getMaxCatchRate,
    addPokemonToInventory,
    getUserPokemons,
    getUserInfo,
    getHashedPassword,
    updateUserInfo
}