// src/controllers/index.js

const showHomePage = async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
};

/**
 * W05: Dashboard (requer login)
 * Página inicial após login do usuário.
 */
const showDashboard = async (req, res) => {
    const title = 'Dashboard';
    res.render('dashboard', { title });
};

export { showHomePage, showDashboard };