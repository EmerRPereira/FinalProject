// src/routes.js
import express from 'express';

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

const router = express.Router();

/* ============================================================
 * Authentication routes (W05)
 * ============================================================
 * Registro, login e logout.
 */
router.get('/register', showRegisterForm);
router.post('/register', processRegister);
router.get('/login', showLoginForm);
router.post('/login', processLogin);
router.get('/logout', processLogout);

/* ============================================================
 * Main routes (públicas)
 * ============================================================
 * Acessíveis sem login.
 */
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

/* ============================================================
 * Detail routes (públicas)
 * ============================================================
 * Detalhes de organização, projeto e categoria.
 */
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/category/:id', showCategoryDetailsPage);

/* ============================================================
 * W05 Assignment: Dashboard (requer login)
 * ============================================================
 * Página inicial após login. Redireciona para /login se não
 * estiver autenticado.
 */
router.get('/dashboard', requireLogin, showDashboard);

/* ============================================================
 * W05 Assignment: Users list (requer admin)
 * ============================================================
 * Lista todos os usuários registrados. Apenas admins podem
 * acessar. Non-admins são redirecionados para /dashboard.
 */
router.get('/users', requireRole('admin'), showUsersPage);

/* ============================================================
 * W05: Rotas administrativas (protegidas por requireRole)
 * ============================================================
 * Todas as rotas de criação/edição exigem role 'admin'.
 * Aplicado em GET (mostra formulário) e POST (processa envio).
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
 * Error test route (desenvolvimento)
 * ============================================================
 * Rota para testar o handler de erro 500.
 */
router.get('/test-error', testErrorPage);

export default router;