const debug = require('debug')('app:startup');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('./middleware/logger');
const auth = require('./middleware/authenticate');
const coursesRoutes = require('./routes/courses');
const homeRoutes = require('./routes/home');
const sequelize = require('./db');
require('./models/Course');
const express = require('express');
const app = express();

// TEMPLATE ENGINE SETUP
app.set('view engine', 'pug');
app.set('views', './views'); // default

// built-in middleware
app.use(express.json()); // req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Third-party middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('tiny'));
  debug('Morgan enabled...');
}
// app.get('env') === 'development' && app.use(morgan('tiny'));
app.use(helmet());

// custom middleware
app.use(logger);
app.use(auth);
app.use('/api/courses', coursesRoutes);
app.use('/', homeRoutes);

// Configuration
console.log('Application Name: ', config.get('name'));
console.log('Mail Server: ', config.get('mail.host'));
// console.log('Mail Password: ', config.get('mail.password'));

const port = process.env.PORT || 3000;

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    const server = app.listen(port, () => {
      console.log('Your app is listening on port ' + server.address().port);
    });
  })
  .catch(err => {
    console.log(err);
    console.log('DB has not been connected.');
  });
