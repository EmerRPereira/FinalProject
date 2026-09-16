// server.js
import 'dotenv/config'; 
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Importar modelos
import { getAllProjects } from './models/projects.js';
import { getAllOrganizations } from './models/organizations.js';
import { getAllCategories } from './models/categories.js';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
// O Render define a PORT automaticamente. Usamos 3000 como fallback local.
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * Configuração de Middleware
 */
// Servir arquivos estáticos (CSS, imagens)
app.use(express.static(path.join(__dirname, 'css')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/**
 * Rotas
 */
app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

app.get('/organizations', async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Our Partner Organizations';
        res.render('organizations', { title, organizations });
    } catch (err) {
        console.error('Error loading organizations:', err);
        res.status(500).send('Error loading organizations');
    }
});

app.get('/projects', async (req, res) => {
    try {
        const projects = await getAllProjects();
        const title = 'Service Projects';
        res.render('projects', { title, projects });
    } catch (err) {
        console.error('Error loading projects:', err);
        res.status(500).send('Error loading projects');
    }
});

app.get('/categories', async (req, res) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Categories';
        res.render('categories', { title, categories });
    } catch (err) {
        console.error('Error loading categories:', err);
        res.status(500).send('Error loading categories');
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
});