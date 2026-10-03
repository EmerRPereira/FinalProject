-- ============================================================
-- CSE 340 Service Network - Database Setup Script
-- Run this file to recreate the database from scratch.
-- ============================================================

-- ============================================================
-- 0. CLEANLINESS (order matters because of FKs)
-- ============================================================
DROP TABLE IF EXISTS project_volunteers CASCADE;
DROP TABLE IF EXISTS project_categories CASCADE;
DROP TABLE IF EXISTS service_projects CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- ============================================================
-- 1. TABLE: roles (W05)
-- ============================================================
CREATE TABLE roles (
    role_id   SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- ============================================================
-- 2. TABLE: users (W05)
-- ============================================================
CREATE TABLE users (
    user_id       SERIAL PRIMARY KEY,
    name          VARCHAR(150) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id       INTEGER NOT NULL REFERENCES roles(role_id)
);

-- ============================================================
-- 3. TABLE: organizations
-- ============================================================
CREATE TABLE organizations (
    organization_id SERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    description     TEXT         NOT NULL,
    contact_email   VARCHAR(255) NOT NULL,
    logo_filename   VARCHAR(255) NOT NULL
);

-- ============================================================
-- 4. TABLE: categories
-- ============================================================
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE
);

-- ============================================================
-- 5. TABLE: service_projects
-- ============================================================
CREATE TABLE service_projects (
    project_id      SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(organization_id),
    title           VARCHAR(200) NOT NULL,
    description     TEXT         NOT NULL,
    location        VARCHAR(200) NOT NULL,
    date            DATE         NOT NULL
);

-- ============================================================
-- 6. JOIN TABLE: project_categories (N:N)
-- ============================================================
CREATE TABLE project_categories (
    project_id  INTEGER NOT NULL REFERENCES service_projects(project_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(category_id)       ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- ============================================================
-- 7. JOIN TABLE: project_volunteers (W06 - N:N)
-- ============================================================
CREATE TABLE project_volunteers (
    user_id    INTEGER NOT NULL REFERENCES users(user_id)              ON DELETE CASCADE,
    project_id INTEGER NOT NULL REFERENCES service_projects(project_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, project_id)
);

-- ============================================================
-- 8. DATA: roles
-- ============================================================
INSERT INTO roles (role_name) VALUES
('user'),
('admin');

-- ============================================================
-- 9. EXAMPLE DATA: organizations
-- ============================================================
INSERT INTO organizations (name, description, contact_email, logo_filename) VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ============================================================
-- 10. EXAMPLE DATA: categories
-- ============================================================
INSERT INTO categories (name) VALUES
('Environment'),
('Education'),
('Community Service'),
('Health & Wellness');

-- ============================================================
-- 11. EXAMPLE DATA: service_projects
-- ============================================================
INSERT INTO service_projects (organization_id, title, description, location, date) VALUES
(1, 'Community Center Renovation', 'Renovate the local community center to serve more families.', 'São Paulo, SP', '2026-03-15'),
(1, 'Affordable Housing Build',    'Build affordable homes for low-income families.',           'Rio de Janeiro, RJ', '2026-04-20'),
(1, 'School Roof Repair',          'Repair the roof of a local public school.',                  'Belo Horizonte, MG', '2026-05-10'),
(1, 'Park Restoration Project',    'Restore a public park with new benches and trees.',          'Curitiba, PR', '2026-06-05'),
(1, 'Bridge Safety Inspection',    'Inspect and reinforce a pedestrian bridge.',                 'Porto Alegre, RS', '2026-07-12'),
(2, 'Urban Garden Setup',          'Create an urban garden in a vacant lot.',                    'São Paulo, SP', '2026-03-22'),
(2, 'Composting Workshop',         'Teach composting techniques to local residents.',            'Salvador, BA', '2026-04-18'),
(2, 'School Garden Program',       'Build gardens in three public schools.',                     'Recife, PE', '2026-05-14'),
(2, 'Farmers Market Support',      'Help local farmers sell produce at markets.',                'Fortaleza, CE', '2026-06-09'),
(2, 'Seed Distribution Drive',     'Distribute seeds to community gardeners.',                   'Manaus, AM', '2026-07-25'),
(3, 'Food Bank Volunteer Day',     'Sort and distribute food at the local food bank.',           'São Paulo, SP', '2026-03-30'),
(3, 'Senior Center Visit',         'Spend time with seniors at a local care center.',            'Brasília, DF', '2026-04-27'),
(3, 'Homeless Shelter Support',    'Prepare meals and provide supplies for a shelter.',          'Rio de Janeiro, RJ', '2026-05-19'),
(3, 'Blood Donation Drive',        'Coordinate a blood donation campaign.',                      'Belo Horizonte, MG', '2026-06-22'),
(3, 'Literacy Tutoring Program',   'Tutor children in reading and writing.',                     'Salvador, BA', '2026-07-30');

-- ============================================================
-- 12. EXAMPLE DATA: project_categories
-- ============================================================
INSERT INTO project_categories (project_id, category_id) VALUES
(1, 3), (1, 4),
(2, 3),
(3, 2), (3, 3),
(4, 1), (4, 3),
(5, 3),
(6, 1), (6, 2),
(7, 1), (7, 2),
(8, 1), (8, 2),
(9, 1),
(10, 1), (10, 2),
(11, 3), (11, 4),
(12, 3), (12, 4),
(13, 3), (13, 4),
(14, 4),
(15, 2), (15, 3);

-- ==========================================================
-- 13. NOTE: The admin account (admin@example.com) must be created
-- through the website's REGISTRATION PAGE (for bcrypt to work).
-- Then, run the UPDATE below to give the admin role:
--
-- UPDATE users SET role_id = (SELECT role_id FROM roles WHERE role_name = 'admin')
-- WHERE email = 'admin@example.com';
-- ============================================================