// src/controllers/volunteers.js
import {
    addVolunteer,
    removeVolunteer
} from '../models/volunteers.js';

/**
 * Adiciona o usuário logado como voluntário em um projeto (W06).
 * Rota protegida por requireLogin.
 */
const processVolunteerSignup = async (req, res, next) => {
    try {
        const userId = req.session.user.user_id;
        const projectId = req.params.projectId;

        const added = await addVolunteer(userId, projectId);

        if (added) {
            req.flash('success', 'You are now volunteering for this project!');
        } else {
            req.flash('info', 'You are already volunteering for this project.');
        }

        res.redirect(`/project/${projectId}`);
    } catch (err) {
        next(err);
    }
};

/**
 * Remove o usuário logado como voluntário de um projeto (W06).
 * Rota protegida por requireLogin.
 */
const processVolunteerRemoval = async (req, res, next) => {
    try {
        const userId = req.session.user.user_id;
        const projectId = req.params.projectId;

        const removed = await removeVolunteer(userId, projectId);

        if (removed) {
            req.flash('success', 'You are no longer volunteering for this project.');
        } else {
            req.flash('info', 'You were not volunteering for this project.');
        }

        // Redireciona para onde o usuário veio (dashboard ou project details)
        const referer = req.get('Referer') || `/project/${projectId}`;
        res.redirect(referer);
    } catch (err) {
        next(err);
    }
};

export {
    processVolunteerSignup,
    processVolunteerRemoval
};