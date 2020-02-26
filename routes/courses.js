const router = require('express').Router();
const Joi = require('@hapi/joi');

const Course = require('../models/Course');

// Course.create({ name: 'Course 2' });

const courses = [
  { id: 1, name: 'Course 1' },
  { id: 2, name: 'Course 2' },
  { id: 3, name: 'Course 3' }
];

router.get('/', async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.status(200).send(courses);
  } catch (err) {
    console.log(err);
  }
});

router.post('/', async (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const course = await Course.create({
      name: req.body.name
    });

    res.status(201).send(course);
  } catch (err) {
    console.log(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    // Look up the course
    const course = await Course.findAll({
      where: { id: parseInt(req.params.id) }
    });

    // If not existing, return 404
    if (!course.length) return res.status(404).send('The course with the given ID was not found.');

    // Validate
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Update course
    const updatedCourse = await Course.update(
      { name: req.body.name },
      {
        where: { id: parseInt(req.params.id) }
      }
    );

    // return the updated course
    res.send(updatedCourse);
  } catch (err) {
    console.log(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // Look up the course
    const course = await Course.findAll({
      where: { id: parseInt(req.params.id) }
    });

    // If not existing, return 404
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    await Course.destroy({
      where: {
        id: parseInt(req.params.id)
      }
    });

    res.status(204).send({ msg: 'deleted successfully' });
  } catch (err) {
    console.log(err);
  }
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .required()
  });

  return schema.validate(course);
}

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findAll({
      // attributes: ['id', 'name', 'createdAt'],
      attributes: { exclude: ['updatedAt'] },
      where: { id: parseInt(req.params.id) }
    });
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    // /?test=hello
    console.log('Query:', req.query);
    res.status(200).send(course);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
