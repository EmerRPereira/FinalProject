// src/controllers/users.js
import {
    createUser,
    findUserByEmail,
    verifyPassword,
    getAllUsers
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
 */
const processRegister = async (req, res) => {
    const { name, email, password } = req.body;

    try {
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

        req.session.user = {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            role_name: user.role_name
        };

        req.flash('success', `Welcome back, ${user.name}!`);
        res.redirect('/dashboard');
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
 * W05: Middleware requireLogin (fábrica de funções)
 * ============================================================
 * Garante que o usuário está logado. Se não estiver,
 * redireciona para /login com uma mensagem.
 */
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

/**
 * ============================================================
 * W05: Middleware requireRole (fábrica de funções)
 * ============================================================
 */
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session.user) {
            req.flash('error', 'You must be logged in to access that page.');
            return res.redirect('/login');
        }

        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access that page.');
            return res.redirect('/dashboard');
        }

        next();
    };
};

/**
 * ============================================================
 * W05 Assignment: Mostra a página com todos os usuários
 * ============================================================
 * Esta rota é protegida por requireRole('admin') no routes.js,
 * então só chega aqui se o usuário for admin.
 */
const showUsersPage = async (req, res, next) => {
    try {
        const users = await getAllUsers();
        const title = 'Registered Users';
        res.render('users', { title, users });
    } catch (err) {
        next(err);
    }
};

export {
    showRegisterForm,
    processRegister,
    showLoginForm,
    processLogin,
    processLogout,
    requireLogin,
    requireRole,
    showUsersPage
};