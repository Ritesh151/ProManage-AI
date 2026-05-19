const express = require('express');
const router = express.Router();
const {
  createProject, getProjects, getProject, updateProject, deleteProject,
} = require('../controllers/projectController');

router.route('/')
  .get(getProjects);

router.post('/create', createProject);

router.route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;
