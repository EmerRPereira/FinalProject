// src/models/categories.js
import db from './db.js';

// Lista todas as categorias
const getAllCategories = async () => {
    const query = 'SELECT * FROM categories ORDER BY name;';
    const result = await db.query(query);
    return result.rows;
};

// Busca uma categoria específica por ID
const getCategoryDetails = async (categoryId) => {
    const query = 'SELECT * FROM categories WHERE category_id = $1;';
    const result = await db.query(query, [categoryId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

// Busca todos os projetos de uma categoria
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.date,
            sp.organization_id,
            o.name AS organization_name
        FROM service_projects sp
        JOIN project_categories pc ON pc.project_id = sp.project_id
        JOIN organizations o ON o.organization_id = sp.organization_id
        WHERE pc.category_id = $1
        ORDER BY sp.date;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows;
};

/**
 * Creates a new category in the database (W04)
 */
const createCategory = async (name) => {
    const query = `
        INSERT INTO categories (name)
        VALUES ($1)
        RETURNING category_id;
    `;
    const result = await db.query(query, [name]);

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new category with ID:', result.rows[0].category_id);
    }

    return result.rows[0].category_id;
};

/**
 * Updates an existing category in the database (W04)
 */
const updateCategory = async (categoryId, name) => {
    const query = `
        UPDATE categories
        SET name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;
    const result = await db.query(query, [name, categoryId]);

    if (result.rows.length === 0) {
        throw new Error('Category not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated category with ID:', categoryId);
    }

    return result.rows[0].category_id;
};

/**
 * Assigns a single category to a project in the join table (W04)
 */
const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_categories (category_id, project_id)
        VALUES ($1, $2);
    `;
    await db.query(query, [categoryId, projectId]);
};

/**
 * Updates the category assignments for a project (W04)
 * First removes all existing assignments, then adds the new ones.
 */
const updateCategoryAssignments = async (projectId, categoryIds) => {
    const deleteQuery = `
        DELETE FROM project_categories
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};

export {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    createCategory,
    updateCategory,
    updateCategoryAssignments
};