// src/server.js
import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

import router from './routes.js';                    // ✅ mesmo nível (dentro de src/)
import { testConnection } from './models/db.js';     // ✅ subpasta de src/

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);          // = .../FinalProject/src

const app = express();

/**
 * Middleware
 */
// Como css/ e images/ estão DENTRO de src/ (mesmo nível de server.js):
app.use(express.static(path.join(__dirname, 'css')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));     // ✅ views/ dentro de src/

// Log em desenvolvimento
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// Expor NODE_ENV aos templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

/**
 * Rotas
 */
app.use(router);

/**
 * Tratamento de Erros
 */
// Catch-all 404
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Error handler global (ÚLTIMO middleware)
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);

    const status = err.status || 500;

    let template = '500';
    if (status === 404) template = '404';
    else if (status === 400) template = '400';

    const context = {
        title: status === 404 ? 'Page Not Found'
             : status === 400 ? 'Bad Request'
             : 'Server Error',
        error: err.message,
        stack: err.stack
    };

    res.status(status).render(`errors/${template}`, context);
});

// Iniciar servidor
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
    try {
        await testConnection();
    } catch (err) {
        console.error('Database connection check failed on startup.');
    }
});