// src/controllers/index.js
import { getVolunteerProjectsByUserId } from '../models/volunteers.js';

const showHomePage = async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
};

/**
 * W05: Dashboard (requer login)
 * W06: Também mostra os projetos em que o usuário é voluntário.
 */
const showDashboard = async (req, res, next) => {
    try {
        const userId = req.session.user.user_id;
        const volunteerProjects = await getVolunteerProjectsByUserId(userId);
        const title = 'Dashboard';
        res.render('dashboard', { title, volunteerProjects });
    } catch (err) {
        next(err);
    }
};

export { showHomePage, showDashboard };