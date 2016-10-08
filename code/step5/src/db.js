var knex = require('knex');

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:pwd@localhost:5432/todo';

var db;
var inited = false;

export function ensureReady (cb) {
    if (inited) return cb();
    console.log('starting knex... "' + connectionString + '"');
    db = knex({
        client: 'pg',
        connection: connectionString,
        searchPath: 'knex,public'
        }, {debug: false});

    // TIP: Take a look at http://knexjs.org/#Migrations feature if you need a more complex schema evolution management
    db.schema.createTableIfNotExists('items', table => {
        table.increments();
        table.string('title', 40).notNullable();
        table.boolean('completed').defaultTo(false);
        table.integer('order').defaultTo(99999);
    }).asCallback((e, r) => {
        if (!e) {
            inited = true;
            console.log('database knex initialized.');
        }
        cb(e, r);
    });
}

export function all (cb) {
    db('items')
        .select()
        .asCallback((e, r) => {
            if (e) return console.error(e);
            cb(r);
        });
}

export function get (id, cb) {
    db('items').select()
        .where('id', '=', id)
        .asCallback((e, r) => {
            if (e) return console.error(e);
            cb(r[0]);
        });
}

export function create (title, order, cb) {
    db.into('items')
        .insert([{'title': title, 'order': order}])
        .returning('*')
        .asCallback((e, r) => {
            if (e) return console.error(e);
            cb(r[0]);
        });
}

export function clear (cb) {
    db('items')
        .del()
        .asCallback((e, r) => {
            if (e) return console.error(e);
            all(cb);
        });
}

export function remove (id, cb) {
    db('items')
        .where('id', '=', id).del()
        .asCallback((e, r) => {
            if (e) return console.error(e);
            all(cb);
        });
}

export function update (id, body, cb) {
    db('items')
        .where('id', '=', id)
        .update(body)
        .returning('*')
        .asCallback((e, r) => {
            if (e) return console.error(e);
            cb(r[0]);
        });
}
