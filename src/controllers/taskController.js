const Task = require('../models/task');

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=created:desc
const getAllTasks = async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.completed) match.completed = req.query.completed === 'true';
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  try {
    // const tasks = await Task.find({ owner: req.user._id });
    await req.user
      .populate({
        path: 'tasks',
        match,
        options: {
          limit: parseInt(req.query.limit, 10),
          skip: parseInt(req.query.skip, 10),
          sort,
        },
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (err) {
    res.status(500).send(err);
  }
};

const createTask = async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
};

const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) return res.status(404).send();
    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
};

const updateTask = async (req, res) => {
  const updateFields = Object.keys(req.body);
  const allowedFields = ['description', 'completed'];
  const areValidFields = updateFields.every((update) =>
    allowedFields.includes(update)
  );
  if (!areValidFields)
    return res.status(400).send({ error: 'Invalid update fields' });

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) return res.status(404).send();

    updateFields.forEach((field) => {
      task[field] = req.body[field];
    });

    await task.save();
    res.status(200).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = { getAllTasks, createTask, getTask, updateTask, deleteTask };
