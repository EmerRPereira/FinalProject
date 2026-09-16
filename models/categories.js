// models/categories.js
import db from './db.js';

async function getAllCategories() {
    try {
        const query = 'SELECT * FROM categories ORDER BY name;';
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

export { getAllCategories };