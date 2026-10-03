// src/routes.js
import express from 'express';
import { body } from 'express-validator';

// Controllers públicos
import { showHomePage, showDashboard } from './controllers/index.js';

// Controllers de organizações
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
} from './controllers/organizations.js';

// Controllers de projetos
import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
} from './controllers/projects.js';

// Controllers de categorias
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

// Controller de erros
import { testErrorPage } from './controllers/errors.js';

// W05: autenticação e autorização
import {
    showRegisterForm,
    processRegister,
    showLoginForm,
    processLogin,
    processLogout,
    requireLogin,
    requireRole,
    showUsersPage
} from './controllers/users.js';

// W06: voluntários
import {
    processVolunteerSignup,
    processVolunteerRemoval
} from './controllers/volunteers.js';

const router = express.Router();

/* ============================================================
 * W05: Validação de registro
 * ============================================================
 */
const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required'),

    body('email')
        .isEmail().withMessage('Valid email required'),

    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

/* ============================================================
 * Authentication routes (W05)
 * ============================================================
 */
router.get('/register', showRegisterForm);
router.post('/register', registerValidation, processRegister);
router.get('/login', showLoginForm);
router.post('/login', processLogin);
router.get('/logout', processLogout);

/* ============================================================
 * Main routes (públicas)
 * ============================================================
 */
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

/* ============================================================
 * Detail routes (públicas)
 * ============================================================
 */
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/category/:id', showCategoryDetailsPage);

/* ============================================================
 * W05 Assignment: Dashboard (requer login)
 * ============================================================
 */
router.get('/dashboard', requireLogin, showDashboard);

/* ============================================================
 * W05 Assignment: Users list (requer admin)
 * ============================================================
 */
router.get('/users', requireRole('admin'), showUsersPage);

/* ============================================================
 * W05: Rotas administrativas (protegidas por requireRole)
 * ============================================================
 */

// Organizations
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);

router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

// Projects
router.get('/new-project', requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);

router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);

// Categories
router.get('/new-category', requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);

router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);

// Assign categories to project
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);

/* ============================================================
 * W06: Volunteer routes (requerem login)
 * ============================================================
 * Adicionar e remover voluntário de um projeto.
 * Protegidas por requireLogin — qualquer usuário logado pode
 * se voluntariar, não apenas admins.
 */
router.post('/project/:projectId/volunteer', requireLogin, processVolunteerSignup);
router.post('/project/:projectId/unvolunteer', requireLogin, processVolunteerRemoval);

/* ============================================================
 * Error test route (desenvolvimento)
 * ============================================================
 */
router.get('/test-error', testErrorPage);

export default router;