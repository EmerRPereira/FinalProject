-- ============================================================
-- CSE 340 Service Network - Database Setup Script
-- Execute este arquivo para recriar o banco de dados do zero.
-- ============================================================

-- ============================================================
-- 1. TABELA: organizations
-- ============================================================
DROP TABLE IF EXISTS project_categories CASCADE;
DROP TABLE IF EXISTS service_projects CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

CREATE TABLE organizations (
    organization_id SERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    description     TEXT         NOT NULL,
    contact_email   VARCHAR(255) NOT NULL,
    logo_filename   VARCHAR(255) NOT NULL
);

-- ============================================================
-- 2. TABELA: categories
-- ============================================================
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE
);

-- ============================================================
-- 3. TABELA: service_projects
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
-- 4. TABELA DE JUNÇÃO: project_categories (N:N)
-- ============================================================
CREATE TABLE project_categories (
    project_id  INTEGER NOT NULL REFERENCES service_projects(project_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(category_id)       ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- ============================================================
-- 5. DADOS DE EXEMPLO: organizations
-- ============================================================
INSERT INTO organizations (name, description, contact_email, logo_filename) VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ============================================================
-- 6. DADOS DE EXEMPLO: categories
-- ============================================================
INSERT INTO categories (name) VALUES
('Environment'),
('Education'),
('Community Service'),
('Health & Wellness');

-- ============================================================
-- 7. DADOS DE EXEMPLO: service_projects (5 por organização = 15)
-- ============================================================
INSERT INTO service_projects (organization_id, title, description, location, date) VALUES
-- BrightFuture Builders (organization_id = 1)
(1, 'Community Center Renovation', 'Renovate the local community center to serve more families.', 'São Paulo, SP', '2026-03-15'),
(1, 'Affordable Housing Build',    'Build affordable homes for low-income families.',           'Rio de Janeiro, RJ', '2026-04-20'),
(1, 'School Roof Repair',          'Repair the roof of a local public school.',                  'Belo Horizonte, MG', '2026-05-10'),
(1, 'Park Restoration Project',    'Restore a public park with new benches and trees.',          'Curitiba, PR', '2026-06-05'),
(1, 'Bridge Safety Inspection',    'Inspect and reinforce a pedestrian bridge.',                 'Porto Alegre, RS', '2026-07-12'),

-- GreenHarvest Growers (organization_id = 2)
(2, 'Urban Garden Setup',          'Create an urban garden in a vacant lot.',                    'São Paulo, SP', '2026-03-22'),
(2, 'Composting Workshop',         'Teach composting techniques to local residents.',            'Salvador, BA', '2026-04-18'),
(2, 'School Garden Program',       'Build gardens in three public schools.',                     'Recife, PE', '2026-05-14'),
(2, 'Farmers Market Support',      'Help local farmers sell produce at markets.',                'Fortaleza, CE', '2026-06-09'),
(2, 'Seed Distribution Drive',     'Distribute seeds to community gardeners.',                   'Manaus, AM', '2026-07-25'),

-- UnityServe Volunteers (organization_id = 3)
(3, 'Food Bank Volunteer Day',     'Sort and distribute food at the local food bank.',           'São Paulo, SP', '2026-03-30'),
(3, 'Senior Center Visit',         'Spend time with seniors at a local care center.',            'Brasília, DF', '2026-04-27'),
(3, 'Homeless Shelter Support',    'Prepare meals and provide supplies for a shelter.',          'Rio de Janeiro, RJ', '2026-05-19'),
(3, 'Blood Donation Drive',        'Coordinate a blood donation campaign.',                      'Belo Horizonte, MG', '2026-06-22'),
(3, 'Literacy Tutoring Program',   'Tutor children in reading and writing.',                     'Salvador, BA', '2026-07-30');

-- ============================================================
-- 8. DADOS DE EXEMPLO: project_categories (associa cada projeto a 1+ categoria)
-- ============================================================
INSERT INTO project_categories (project_id, category_id) VALUES
-- Projetos de BrightFuture (1-5)
(1, 3), (1, 4),   -- Community Center Renovation → Community Service, Health
(2, 3),           -- Affordable Housing Build → Community Service
(3, 2), (3, 3),   -- School Roof Repair → Education, Community Service
(4, 1), (4, 3),   -- Park Restoration → Environment, Community Service
(5, 3),           -- Bridge Safety Inspection → Community Service

-- Projetos de GreenHarvest (6-10)
(6, 1), (6, 2),   -- Urban Garden Setup → Environment, Education
(7, 1), (7, 2),   -- Composting Workshop → Environment, Education
(8, 1), (8, 2),   -- School Garden Program → Environment, Education
(9, 1),           -- Farmers Market Support → Environment
(10, 1), (10, 2), -- Seed Distribution Drive → Environment, Education

-- Projetos de UnityServe (11-15)
(11, 3), (11, 4), -- Food Bank Volunteer Day → Community Service, Health
(12, 3), (12, 4), -- Senior Center Visit → Community Service, Health
(13, 3), (13, 4), -- Homeless Shelter Support → Community Service, Health
(14, 4),          -- Blood Donation Drive → Health
(15, 2), (15, 3); -- Literacy Tutoring → Education, Community Service