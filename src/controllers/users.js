// src/controllers/users.js
import {
    createUser,
    findUserByEmail,
    verifyPassword
} from '../models/users.js';

/**
 * Mostra o formulário de registro.
 */
const showRegisterForm = (req, res) => {
    const title = 'Register';
    res.render('register', { title });
};

/**
 * Processa o formulário de registro.
 * Cria um novo usuário com role 'user' por padrão.
 */
const processRegister = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Verifica se já existe
        const existing = await findUserByEmail(email);
        if (existing) {
            req.flash('error', 'Email already registered.');
            return res.redirect('/register');
        }

        await createUser(name, email, password);
        req.flash('success', 'Account created! Please log in.');
        res.redirect('/login');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'There was an error creating your account.');
        res.redirect('/register');
    }
};

/**
 * Mostra o formulário de login.
 */
const showLoginForm = (req, res) => {
    const title = 'Login';
    res.render('login', { title });
};

/**
 * Processa o formulário de login.
 * Armazena os dados do usuário na sessão (incluindo role_name).
 */
const processLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        const passwordMatches = await verifyPassword(password, user.password_hash);

        if (!passwordMatches) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        // Salva os dados na sessão (NÃO inclui password_hash!)
        req.session.user = {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role_name: user.role_name
        };

        req.flash('success', `Welcome back, ${user.name}!`);
        res.redirect('/');
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'There was an error logging in.');
        res.redirect('/login');
    }
};

/**
 * Processa o logout.
 */
const processLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/');
    });
};

/**
 * ============================================================
 * W05: Middleware requireRole (fábrica de funções)
 * ============================================================
 * Retorna um middleware que verifica se o usuário logado possui
 * a role especificada. Como o Express só passa (req, res, next)
 * para middlewares, precisamos de uma fábrica de funções para
 * permitir parâmetros extras (a role exigida).
 */
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session.user) {
            req.flash('error', 'You must be logged in to access that page.');
            return res.redirect('/');
        }

        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access that page.');
            return res.redirect('/');
        }

        next();
    };
};

export {
    showRegisterForm,
    processRegister,
    showLoginForm,
    processLogin,
    processLogout,
    requireRole
};