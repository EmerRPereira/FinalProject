// models/categories.js
import db from './db.js';

// Lista todas as categorias
const getAllCategories = async () => {
    try {
        const query = 'SELECT * FROM categories ORDER BY name;';
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

// Busca uma categoria específica por ID
const getCategoryDetails = async (categoryId) => {
    try {
        const query = 'SELECT * FROM categories WHERE category_id = $1;';
        const result = await db.query(query, [categoryId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        console.error('Error fetching category details:', error);
        throw error;
    }
};

// Busca todos os projetos de uma categoria
const getProjectsByCategoryId = async (categoryId) => {
    try {
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
    } catch (error) {
        console.error('Error fetching projects by category:', error);
        throw error;
    }
};

export {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId
};