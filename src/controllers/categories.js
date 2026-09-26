// src/controllers/categories.js
import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId,
    createCategory,
    updateCategory,
    updateCategoryAssignments
} from '../models/categories.js';
import { getProjectDetails, getCategoriesByProjectId } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

/**
 * Validation rules for category create/edit forms (W04)
 * Server-side: name required, min 3, max 100.
 * Client-side (HTML): required + maxlength=100 (min NOT added on purpose).
 */
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Categories';
        res.render('categories', { title, categories });
    } catch (err) {
        next(err);
    }
};

const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryDetails(categoryId);

        if (!category) {
            const err = new Error('Category Not Found');
            err.status = 404;
            return next(err);
        }

        const projects = await getProjectsByCategoryId(categoryId);
        const title = category.name;

        res.render('category', { title, category, projects });
    } catch (err) {
        next(err);
    }
};

const showNewCategoryForm = (req, res) => {
    const title = 'Add New Category';
    res.render('new-category', { title });
};

const processNewCategoryForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-category');
    }

    const { name } = req.body;

    try {
        const newCategoryId = await createCategory(name);
        req.flash('success', 'Category added successfully!');
        res.redirect(`/category/${newCategoryId}`);
    } catch (error) {
        console.error('Error creating category:', error);
        req.flash('error', 'There was an error creating the category.');
        res.redirect('/new-category');
    }
};

const showEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryDetails(categoryId);

        if (!category) {
            const err = new Error('Category Not Found');
            err.status = 404;
            return next(err);
        }

        const title = 'Edit Category';
        res.render('edit-category', { title, category });
    } catch (err) {
        next(err);
    }
};

const processEditCategoryForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/edit-category/' + req.params.id);
    }

    const categoryId = req.params.id;
    const { name } = req.body;

    try {
        await updateCategory(categoryId, name);
        req.flash('success', 'Category updated successfully!');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error('Error updating category:', error);
        req.flash('error', 'There was an error updating the category.');
        res.redirect('/edit-category/' + categoryId);
    }
};

const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const projectDetails = await getProjectDetails(projectId);

        if (!projectDetails) {
            const err = new Error('Project Not Found');
            err.status = 404;
            return next(err);
        }

        const categories = await getAllCategories();
        const assignedCategories = await getCategoriesByProjectId(projectId);

        const title = `Assign Categories to ${projectDetails.title}`;
        res.render('assign-categories', {
            title,
            projectId,
            projectDetails,
            categories,
            assignedCategories
        });
    } catch (err) {
        next(err);
    }
};

const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        let categoryIds = req.body.categoryIds || [];
        if (!Array.isArray(categoryIds)) {
            categoryIds = [categoryIds];
        }

        await updateCategoryAssignments(projectId, categoryIds);

        req.flash('success', 'Category assignments updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (err) {
        next(err);
    }
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    categoryValidation
};