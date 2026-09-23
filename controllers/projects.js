// controllers/projects.js

import {
    getUpcomingProjects,
    getProjectDetails,
    getCategoriesByProjectId
} from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects';
        res.render('projects', { title, projects });
    } catch (err) {
        next(err);
    }
};

const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        // NOVO: buscar categorias do projeto
        const categories = await getCategoriesByProjectId(projectId);

        const title = project.title;
        res.render('project', { title, project, categories });
    } catch (err) {
        next(err);
    }
};

export { showProjectsPage, showProjectDetailsPage };