const express = require('express');
const router = express.Router();
const {
  getTasksByProject, createTask, updateTask, deleteTask, updateTaskStatus,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/project/:projectId', getTasksByProject);
router.post('/', createTask);
router.route('/:id').put(updateTask).delete(deleteTask);
router.patch('/:id/status', updateTaskStatus);

module.exports = router;
