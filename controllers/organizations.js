// controllers/organizations.js

import { getAllOrganizations, getOrganizationDetails } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });
};

const showOrganizationDetailsPage = async (req, res, next) => {
    try {
        const organizationId = req.params.id;
        const organizationDetails = await getOrganizationDetails(organizationId);

        // Se a organização não existir, gera um 404
        if (!organizationDetails) {
            const err = new Error('Organization Not Found');
            err.status = 404;
            return next(err);
        }

        const projects = await getProjectsByOrganizationId(organizationId);
        const title = 'Organization Details';

        res.render('organization', { title, organizationDetails, projects });
    } catch (err) {
        next(err);
    }
};

export { showOrganizationsPage, showOrganizationDetailsPage };