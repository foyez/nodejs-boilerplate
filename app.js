const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('@hapi/joi');
const logger = require('./middleware/logger');
const auth = require('./middleware/authenticate');
const express = require('express');
const app = express();

// built-in middleware
app.use(express.json()); // req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Third-party middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('tiny'));
  console.log('Morgan enabled...');
}
// app.get('env') === 'development' && app.use(morgan('tiny'));
app.use(helmet());

// custom middleware
app.use(logger);
app.use(auth);

// Configuration
console.log('Application Name: ', config.get('name'));
console.log('Mail Server: ', config.get('mail.host'));
console.log('Mail Password: ', config.get('mail.password'));

const courses = [
  { id: 1, name: 'Course 1' },
  { id: 2, name: 'Course 2' },
  { id: 3, name: 'Course 3' }
];

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
  // Look up the course
  const course = courses.find(course => course.id === parseInt(req.params.id));
  // If not existing, return 404
  if (!course) return res.status(404).send('The course with the given ID was not found.');

  // Validate
  const { error } = validateCourse(req.body);
  // If invalid, return 400 - Bad request
  if (error) return res.status(400).send(error.details[0].message);

  // Update course
  course.name = req.body.name;
  // return the updated course
  res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
  // Look up the course
  const course = courses.find(course => course.id === parseInt(req.params.id));
  // If not existing, return 404
  if (!course) return res.status(404).send('The course with the given ID was not found.');

  const index = courses.find.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .required()
  });

  return schema.validate(course);
}

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(course => course.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with the given ID was not found.');

  // /?test=hello
  console.log('Query:', req.query);
  res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running in ${port} port...`));
