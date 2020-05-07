const express = require('express');
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

const router = new express.Router();

router.use(auth);
router
  .route('/')
  .get(taskController.getAllTasks)
  .post(taskController.createTask);

router
  .route('/:id')
  .get(taskController.getTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
