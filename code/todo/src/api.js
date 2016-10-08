export function configure (app, db) {
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
}
