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
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_categories
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};

export {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    updateCategoryAssignments
};