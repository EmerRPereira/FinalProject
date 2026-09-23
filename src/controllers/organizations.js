// src/controllers/organizations.js
import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization
} from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

/**
 * Show list of all organizations
 */
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });
};

/**
 * Show details of a single organization
 */
const showOrganizationDetailsPage = async (req, res, next) => {
    try {
        const organizationId = req.params.id;
        const organizationDetails = await getOrganizationDetails(organizationId);

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

/**
 * Show the new organization form (W04)
 */
const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';
    res.render('new-organization', { title });
};

/**
 * Process the new organization form submission (W04)
 */
const processNewOrganizationForm = async (req, res) => {
    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png';

    const organizationId = await createOrganization(
        name,
        description,
        contactEmail,
        logoFilename
    );

    // Set a success flash message
    req.flash('success', 'Organization added successfully!');

    res.redirect(`/organization/${organizationId}`);
};

export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm
};