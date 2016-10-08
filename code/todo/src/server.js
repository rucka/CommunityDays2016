import express from 'express';
import bodyParser from 'body-parser'; // The bodyParser object exposes various factories to create middlewares. All middlewares will populate the req.body property with the parsed body or provide an error to the callback -->https://www.npmjs.com/package/body-parser
import path from 'path';
import * as auth from './auth';
import * as api from './api';

import * as db from './memory.js';
// import * as db from './db.js';

const app = express();

app.use(bodyParser.json());

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '../views'));
app.locals.basedir = path.join(__dirname, '../views'); // set basedir as local variable visible from all views of the view-engine

auth.configure(app);

app.use((req, res, next) => db.ensureReady(next));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`requested ${req.method} url:"${req.url}" -> ${JSON.stringify(req.body)}`);
  }
  next();
});

app.use(express.static(path.join(__dirname, '/../public')));
app.use('/specs', express.static(path.join(__dirname, '/../specs')));

app.get('/home', (req, res) => {
  res.render('home', {
    title: 'Home page',
    message: 'Welcome to the TODO node app'
  });
});

api.configure(app, db);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Todo App listening on port ${port}!`);
});
