// src/models/volunteers.js
import db from './db.js';

/**
 * Adiciona um usuário como voluntário em um projeto (W06).
 * Usa ON CONFLICT DO NOTHING para evitar erro se já for voluntário.
 */
const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO project_volunteers (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
        RETURNING user_id, project_id;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

/**
 * Remove um usuário como voluntário de um projeto (W06).
 */
const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM project_volunteers
        WHERE user_id = $1 AND project_id = $2
        RETURNING user_id, project_id;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

/**
 * Verifica se um usuário é voluntário em um projeto (W06).
 */
const isVolunteer = async (userId, projectId) => {
    const query = `
        SELECT 1 FROM project_volunteers
        WHERE user_id = $1 AND project_id = $2;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

/**
 * Retorna todos os projetos em que um usuário é voluntário (W06).
 */
const getVolunteerProjectsByUserId = async (userId) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.date,
            o.name AS organization_name
        FROM service_projects sp
        JOIN organizations o ON o.organization_id = sp.organization_id
        JOIN project_volunteers pv ON pv.project_id = sp.project_id
        WHERE pv.user_id = $1
        ORDER BY sp.date;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

export {
    addVolunteer,
    removeVolunteer,
    isVolunteer,
    getVolunteerProjectsByUserId
};