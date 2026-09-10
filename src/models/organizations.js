// src/models/organizations.js
import db from '../db.js';

async function getAllOrganizations() {
    try {
        const query = 'SELECT * FROM organizations ORDER BY name;';
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching organizations:', error);
        throw error;
    }
}

export { getAllOrganizations };