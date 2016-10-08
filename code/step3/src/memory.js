let data = [];
const clone = o => JSON.parse(JSON.stringify(o));

var inited = false;

export function ensureReady (cb) {
    if (inited) return cb();
    console.log('starting memory...');
    console.log('database memory initialized.');
    inited = true;
    cb(null);
}

export function all (cb) {
    const items = clone(data);
    cb(items);
}

export function get (id, cb) {
    const filtered = data.filter(t => t.id === id);
    if (filtered.length > 0)
        cb(clone(filtered[0]));
    else
        cb(null);
}

export function create (title, order, cb) {
    let item = {
        id: `${data.length + 1}`,
        title: title,
        order: order
    };
    data.push(item);
    cb(clone(item));
}

export function clear (cb) {
    data = [];
    cb(clone(data));
}

export function remove (id, cb) {
    const item = data.filter(t => t.id === id);
    data = data.filter(t => t.id !== id);
    cb(clone(item));
}

export function update (id, body, cb) {
    let allExcept = data.filter(t => t.id !== id);
    if (allExcept.length === data.length) {
        return cb(null);
    }
    let item = clone(body);
    item.id = id;
    allExcept.push(item);
    data = allExcept;
    cb(clone(item));
}
