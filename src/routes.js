// src/routes.js
import express from 'express';

import { showHomePage } from './controllers/index.js';
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm
} from './controllers/organizations.js';
import {
    showProjectsPage,
    showProjectDetailsPage
} from './controllers/projects.js';
import {
    showCategoriesPage,
    showCategoryDetailsPage
} from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

/**
 * Main routes
 */
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

/**
 * Detail routes
 */
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/category/:id', showCategoryDetailsPage);

/**
 * New organization form (W04)
 */
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', processNewOrganizationForm);

/**
 * Error test route
 */
router.get('/test-error', testErrorPage);

export default router;