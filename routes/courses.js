const router = require('express').Router();
const Joi = require('@hapi/joi');

const courses = [
  { id: 1, name: 'Course 1' },
  { id: 2, name: 'Course 2' },
  { id: 3, name: 'Course 3' }
];

router.get('/', (req, res) => {
  res.send(courses);
});

router.post('/', (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

router.get('/:id', (req, res) => {
  const course = courses.find(course => course.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with the given ID was not found.');

  // /?test=hello
  console.log('Query:', req.query);
  res.send(course);
});

module.exports = router;
