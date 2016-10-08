theme: Merriweather, 4

![](assets/landing.png)

---

![](assets/presentazione.png)

---
# `communities map {me}`
![inline](assets/ugidotnetsquare.png)![inline](assets/milanoscala.png)

---

![original](assets/why.jpg)
# **Node.js**

---

##cosa succede ad un webserver quando eseguiamo questa richiesta?  

```csharp

var orders = from o in data.Orders 
	where o.Amount > 10000
	select o;
ShowOrders(orders);

```

---

![](assets/rest.jpg)

---

#[fit]quanto aspettiamo?

- L1-cache __3__ cicli
- L2-cache __14__ cicli
- RAM __250__ cicli
- Disco __41.000.000__ cicli
- Rete __240.000.000__ cicli

---

# soluzione (?)
## web server multithreading
![](assets/iis_apache.jpg)

---

![](assets/homer-computer-doh.jpg)

---
#[fit] Apache vs NGINX [^1]

![](assets/man-couple-people-woman.jpg)

[^1]: http://blog.webfaction.com/2008/12/a-little-holiday-present-10000-reqssec-with-nginx-2/

---

![fit](assets/apachevsngnix1.png)

---

![fit](assets/apachevsngnix2.png)

---

#dov'è la magia?

![](assets/magic.jpg)

---

## web server __single threaded__, bastato su __event loop__

![fit](assets/NGINX_logo.png)

---

![](http://www.saramascitti.it/wp-content/uploads/2016/02/ricette-di-cucina.jpg)

---

#prendiamo un modello monothread, asincrono

---

#[fit]scegliamo un linguaggio

```javascript
$.post("my/rest/api", function (data, status) {
    alert("Data: " + data + "\nStatus: " + status);
});

```

![](assets/js.png)

---

#shakeriamo bene...

![](assets/bartender.jpg)

---

##**Node.Js** viene presentato[^2] alla European JsConf l'8 novembre 2009 da Ryan Dahl
![](assets/nodejs.png)
![](assets/dahl.png)

[^2]: https://www.youtube.com/watch?v=ztspvPYybIY 

---

#[fit]architettura
![fit inline](assets/eventloop.png)

---

![125%](assets/nodetweet.png)

---

![110% center](assets/npm-stats.png)

^ 
- nuget 63k pacchetti, 17 milioni download al mese
- ruby gems 123K pacchetti, 10 miliardi di download totali
- npm 300K pacchetti, 74 milioni di download al giorno, 5 miliardi di download al mese

---
![](assets/caution.jpg)

### *__prima__ di iniziare*...
 
# __javascript__ non è un optional

---
# [fit] scegliete con __cura__

![](assets/JavaScript_books_definitive_guide_vs_good_parts.jpg)


---
# web application in __5__ passi

![](assets/steps.jpg)

---

#[fit] **1**
#API[^3] 
![fill](assets/api.png)

[^3]: https://nodejs.org/en/docs/

---

#[fit] **2**
#Moduli (CommonJS & NPM)
![fill](assets/npm.png)

---
## amici in **5** minuti! 

```bash
$ mkdir todo
$ cd todo
$ npm init
$ echo "console.log('hello cdays16\!');" > index.js
$ node index.js

>> hello cdays16!
```

---

```javascript

const http = require('http');

const hostname = '127.0.0.1';
const port = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  if (req.url === '/ping') return res.end('pong!\n');
  return res.end('Hello World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

```

---

#[fit] **3**
#web framework (express)
![fill](assets/express.jpg)

---

### ```npm install express --save```

```javascript
var express = require('express');
var app = express();
 
app.get('/ping', (req, res) {
  res.send('pong!');
});

app.patch('/api/:id', (req, res) => {
    db.update(req.params.id, req.body, todo => {
        res.send(createTodo(req, todo));
    });
});

app.listen(process.env.PORT || 8000);

```

---

### template engine
### ```npm install jade --save```

```javascript
//app.js                                  		//index.jade
var express = require('express');				html
var app = express();								head
app.set('view engine', 'jade');							title!= title
													body
app.get('/', (req, res) {						        h1!= message
  res.render('index', { 
    title: 'cdays 2016', 
    message: 'hello!' 
  });
});
```

---
### template engine *Razor* like
### ```npm install vash --save```

```html
<ul class="@(model.active ? 'highlight' : '')">
    @model.forEach(function(m){
        <li>@m.name</li>
    })
</ul>
```

---
### template engine *Razor* like
### ```npm install bliss --save```

```html
@!(customer,orders)
<h1>Welcome @customer.name!</h1>

<ul>
@orders.forEach(function(order){
  <li>@order.title</li>
})
</ul>
```

---
#[fit] **4**
#accesso al db (knex [+bookshelf])
![fill](assets/knex.jpg)

---

### ```npm install knex mssql pg --save```

```javascript
const knex = require('knex');

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:pwd@localhost:5432/todo';
bug: false});
const db = knex({client: 'pg', connection: connectionString, searchPath:'knex,public'}, {debug: false});
//const db = knex({client: 'mssql',connection: connectionString,searchPath:'knex,public'}, {de
db.schema.createTableIfNotExists('items', table => {
  table.increments();
  table.string('title', 40).notNullable();
  table.boolean('completed').defaultTo(false);
  table.integer('order').defaultTo(99999);
}).asCallback((e, r) => (if (e) return console.error(e); else console.log('database ready')));

export function get (id, cb) {
    db('items').select().where('id', '=', id)
    	.asCallback((e, r) => (if (e) return console.error(e); else cb(r[0])));
}

export function create (title, order, cb) {
    db.into('items')
        .insert([{'title': title, 'order': order}]).returning('*')
        .asCallback((e, r) => (if (e) return console.error(e); else cb(r[0])));
}

```

---

#[fit] **5**
#autenticazione (passport)
![fill](assets/site-passport.jpg)

---

### ```npm install passport passport-local --save```

```javascript
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function (username, password, done) {
      User.findOne({ username: username }, function (err, user) {
          if (err) { return done(err); }
          if (!user) return done(null, false, { message: 'Incorrect username.' });
          if (!user.validPassword(password)) return done(null, false, { message: 'Incorrect password.' });
          
          return done(null, user);
      });
  }
));

app.post('/login', passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
  })
);
```
---

### ```npm install passport passport-twitter --save```

```javascript
var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://www.example.com/auth/twitter/callback"
},
  function(token, tokenSecret, profile, done) {
      User.findOrCreate(profile, function(err, user) {
          if (err) { return done(err); }
          done(null, user);
      });
  }
));

// Redirect the user to Twitter for authentication.  When complete, Twitter will redirect the user back to the application at /auth/twitter/callback
app.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter will redirect the user to this URL after approval.  Finish the authentication process by attempting to obtain an access token.  
//If access was granted, the user will be logged in.  Otherwise, authentication has failed.
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' });

```

---

#[fit] **bonus track**
#unit testing

---
### ```npm install mocha superhost should --save-dev```

```javascript

var request = require('supertest');
var should = require("should");

describe("GET /ping", function () {
	it("respond 'pong!'", function (done) {
    	var app = require('express')();
        app.get('/ping', function (req, res) {
  			res.send('pong!');
		});
        api.configure(app);
        request(app).
            get('/ping').
            expect(200, 'pong!', done);
    });
});   
```

---

![fill](assets/the-host-banner.jpg)

#Node.Js cosa ci **faccio**?

---

![fill](assets/netflix.jpg)
##**web** application
###Express

---

![fill](assets/slack.png)
##**desktop** application
###Electron

---

![fill](assets/grunt-logo.png)
##**tool** e plugin
###(es. grunt, gulp, mocha, forever...)

---

![fill](assets/azurefunctions.png)
##**cloud** application
###Azure Functions

---

#[fit] **Come lo lancio?**
![fill](assets/rocket.jpg)

---
![right 200%](assets/foreverjs.png)


##console application
### foreverjs

```bash
[sudo] npm install -g forever
$ forever
usage: forever [start | stop | stopall | list] [options] SCRIPT [script options]

options:
  start          start SCRIPT as a daemon
  stop           stop the daemon SCRIPT
  stopall        stop all running forever scripts
  list           list all running forever scripts
  
$ forever start simple-server.js
$ forever list
  [0] simple-server.js [ 24597, 24596 ]
$ forever list
  [0] simple-server.js [ 24611, 24596 ]  

```


---

##web server
### iis node module
![fill](assets/iisnode.png)

---

##cloud
### node azure
![fill](assets/nodeazure.png)

---
##container
### docker

![right fit](assets/docker-logo.png)

```docker

FROM node:6.2.2

RUN mkdir /nodejs
COPy index.js /nodejs/
WORKDIR /nodejs
ENTRYPOINT ["node", "index.js"]

EXPOSE 80

```

---

![fill](assets/when.jpg)
#Node.Js **quando**?

---
![fill](assets/yes.jpg)

- Tanti I/O (network, files, db…)
- Realtime application (online games, collaboration tools)
- Come «frontoffice» di un batch server (scritto in Java, .NET, Scala….)
- Vogliamo un unico stack tecnologico tra client e server
- Vogliamo costruire velocemente tools per lo sviluppo


---
![fill](assets/no.jpg)

- Processi cpu intensive
- Logica di business complessa
- Se non si conosce bene (o si sottovaluta) JavaScript

---

![fill](assets/thank.jpeg)

---

![fill](assets/domande.png)