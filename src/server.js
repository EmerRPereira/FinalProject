// src/server.js
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import { fileURLToPath } from 'url';
import path from 'path';

import router from './routes.js';
import { testConnection } from './models/db.js';
import flash from './middleware/flash.js';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * 1. Body parsers (POST data)
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * 2. Session management
 */
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

/**
 * 3. Flash messages
 */
app.use(flash);

/**
 * 4. Static files
 */
app.use(express.static(path.join(__dirname, 'css')));
app.use('/images', express.static(path.join(__dirname, 'images')));

/**
 * 5. View engine
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/**
 * 6. Log em desenvolvimento
 */
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

/**
 * 7. Expor NODE_ENV aos templates
 */
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

/**
 * 8. Rotas
 */
app.use(router);

/**
 * 9. 404 catch-all
 */
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

/**
 * 10. Error handler global
 */
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

/**
 * 11. Start server
 */
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
    try {
        await testConnection();
    } catch (err) {
        console.error('Database connection check failed on startup.');
    }
});