var express = require('express');
var bodyParser = require('body-parser'); // The bodyParser object exposes various factories to create middlewares. All middlewares will populate the req.body property with the parsed body or provide an error to the callback -->https://www.npmjs.com/package/body-parser
var path = require('path');

var auth = require('./auth');

var db = require('./db.js');

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

app.get('/api/ping', (req, res) => res.send('pong!'));

app.get('/api', (req, res) => {
    db.all(todos => {
        res.send(todos.map(d => createTodo(req, d)));
    });
});

app.get('/api/:id', (req, res) => {
    db.get(req.params.id, todo => {
        res.send(createTodo(req, todo));
    });
});

app.post('/api', (req, res) => {
    db.create(req.body.title, req.body.order, todo => {
        res.send(createTodo(req, todo));
    });
});

app.patch('/api/:id', (req, res) => {
    db.update(req.params.id, req.body, todo => {
        res.send(createTodo(req, todo));
    });
});

app.delete('/api', (req, res) => {
    db.clear(todos => {
        res.send(todos.map(todo => createTodo(req, todo)));
    });
});

app.delete('/api/:id', (req, res) => {
    db.remove(req.params.id, todo => {
        res.send(todo);
    });
});

function createTodo (req, data) {
    return {
        title: data.title,
        order: data.order,
        completed: data.completed || false,
        url: req.protocol + '://' + req.get('host') + '/api/' + data.id
    };
}

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Todo App listening on port ${port}!`);
});
