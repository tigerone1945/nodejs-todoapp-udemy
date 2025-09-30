const express = require('express');
const router = express.Router();
const { getAllTasks, createTask, getSingleTask, updateTask, deleteTask } = require('../controllers/tasks');

router.get('', (req, res) => {
  getAllTasks(req, res);
});

router.post('', (req, res) => {
  createTask(req, res);
});

router.get('/:id', (req, res) => {
  getSingleTask(req, res);
});

router.patch('/:id', (req, res) => {
  updateTask(req, res);
});

router.delete('/:id', (req, res) => {
  deleteTask(req, res);
});

module.exports = router;