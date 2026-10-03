// src/models/users.js
import db from './db.js';
import bcrypt from 'bcryptjs';

/**
 * Cria um novo usuário no banco de dados.
 * A senha é criptografada com bcrypt antes de ser armazenada.
 * Por padrão, o usuário recebe a role 'user'.
 */
const createUser = async (name, email, plainPassword) => {
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const query = `
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = 'user'))
        RETURNING user_id, name, email;
    `;
    const result = await db.query(query, [name, email, passwordHash]);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    return result.rows[0];
};

/**
 * Busca um usuário pelo e-mail, retornando o role_name (W05).
 */
const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
    const result = await db.query(query, [email]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Verifica se a senha em texto puro corresponde ao hash armazenado.
 */
const verifyPassword = async (plainPassword, passwordHash) => {
    return bcrypt.compare(plainPassword, passwordHash);
};

/**
 * ============================================================
 * W05 Assignment: Lista todos os usuários com suas roles
 * ============================================================
 */
const getAllUsers = async () => {
    const query = `
        SELECT u.user_id, u.name, u.email, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.name;
    `;
    const result = await db.query(query);
    return result.rows;
};

export {
    createUser,
    findUserByEmail,
    verifyPassword,
    getAllUsers
};