require('dotenv').config();

const express = require('express');

const logger = require('./middlewares/logger.js');
const errorHandler = require('./middlewares/errorHandler.js');
const validator = require('./middlewares/validator.js');
const patchValidator = require('./middlewares/patchValidator.js');

const app = express();

app.use(express.json()); 
app.use(logger);

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

app.get('/todos', (req, res, next) => {
  res.status(200).json(todos); 
});

app.get('/todos/completed', (req, res, next) => {
  const completed = todos.filter((t) => t.completed);
  res.json(completed);
});

app.get('/todos/active', (req, res, next) => {
  const active = todos.filter((t) => !t.completed);
  res.json(active);
});


app.post('/todos', validator, (req, res, next) => {
  try {
    const { task, completed = false } = req.body;
    if (!task) return res.status(400).json({ message: 'task required' });

    const newTodo = { id: todos.length + 1, task, completed };
    todos.push(newTodo);
    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
});

app.get('/todos/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new Error('Invalid ID');
    }

    const todo = todos.find((t) => t.id === id);
    if (!todo) return res.status(400).json('Todo does not exist');
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
});

app.patch('/todos/:id', patchValidator, (req, res, next) => {
  try {
    const todo = todos.find((t) => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    Object.assign(todo, req.body);
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
});

app.delete('/todos/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const initialLength = todos.length;
    todos = todos.filter((t) => t.id !== id);

    if (todos.length === initialLength)
      return res.status(404).json({ error: 'Not found' });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));