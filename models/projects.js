// models/projects.js
import db from './db.js';   // CORRIGIDO: era '../db.js'

async function getAllProjects() {
    try {
        const query = `
            SELECT 
                sp.project_id,
                sp.organization_id,
                sp.title,
                sp.description,
                sp.location,
                sp.date,
                o.name AS organization_name
            FROM service_projects sp
            JOIN organizations o ON sp.organization_id = o.organization_id
            ORDER BY sp.date;
        `;
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
}

export { getAllProjects };