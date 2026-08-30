require('dotenv').config();

const express = require('express');

const connectDB = require('./database/db.js');
const Todo = require('./models/todo.models.js');

const logger = require('./middlewares/logger.js');
const errorHandler = require('./middlewares/errorHandler.js');
const validator = require('./middlewares/validator.js');
const patchValidator = require('./middlewares/patchValidator.js');

const app = express();

connectDB();

app.use(express.json()); 
app.use(logger);

app.get('/todos', async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.completed !== undefined) {
      filter.completed = req.query.completed === 'true';
    }

    const todos = await Todo.find(filter);
    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
});

// CREATE TASK
app.post('/todos', validator, async (req, res, next) => {
  const {task, completed} = req.body;
  const newTodo = new Todo({
    task,
    completed
  })
  
  try {
  await newTodo.save()
  res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
});

app.get('/todos/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(400).json('Todo does not exist');
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
});

//EDIT A TASK
app.patch('/todos/:id', patchValidator, async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!todo) return res.status(400).json('Todo does not exist');
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
});

app.delete('/todos/:id', async (req, res, next) => {
  try {
  const todo = await Todo.findByIdAndDelete(req.params.id);

  if (!todo) return res.status(400).json('Todo does not exist');
  res.status(204).send();

  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server on port`));
