// src/routes.js
import express from 'express';

import { showHomePage } from './controllers/index.js';
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
} from './controllers/organizations.js';
import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
} from './controllers/projects.js';
import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    categoryValidation
} from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

// W05: importa requireRole e controllers de usuários
import {
    showRegisterForm,
    processRegister,
    showLoginForm,
    processLogin,
    processLogout,
    requireRole
} from './controllers/users.js';

const router = express.Router();

/**
 * Authentication routes (W05)
 */
router.get('/register', showRegisterForm);
router.post('/register', processRegister);
router.get('/login', showLoginForm);
router.post('/login', processLogin);
router.get('/logout', processLogout);

/**
 * Main routes (públicas)
 */
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

/**
 * Detail routes (públicas)
 */
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/category/:id', showCategoryDetailsPage);

/**
 * ============================================================
 * W05: Rotas administrativas (protegidas por requireRole)
 * ============================================================
 */

/**
 * New organization form
 */
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);

/**
 * Edit organization form
 */
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

/**
 * New project form
 */
router.get('/new-project', requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);

/**
 * Edit project form
 */
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);

/**
 * New category form
 */
router.get('/new-category', requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);

/**
 * Edit category form
 */
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);

/**
 * Assign categories to project
 */
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);

/**
 * Error test route
 */
router.get('/test-error', testErrorPage);

export default router;