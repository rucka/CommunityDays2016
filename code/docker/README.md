#Step 5 - Docker
##Build and Run
- run ```node install``` to install all external application and development dependences
- run ```npm run compile``` to transpile the code using [babel](https://babeljs.io)
- open folder 'compose'
- run ```docker-compose up``` command to start both PostgreSQL and node containers
- open your browser and go to http://localhost:8000/home

##Dependencies
You need docker up and running to start the database server. Please refer the docker [website](http://www.docker.com/products/overview) if you need to install docker.

##Passport
[Passport](http://passportjs.org) is configured with three strategies: local, [facebook](https://github.com/jaredhanson/passport-facebook) and [twitter](https://github.com/jaredhanson/passport-twitter). 

**Before** using passport-facebook, you must register an application with Facebook. If you have not already done so, a new application can be created at [Facebook Developers](https://developers.facebook.com/). Your application will be issued an app ID and app secret, which need to be provided to the strategy. You will also need to configure a redirect URI which matches the route in your application.

**Before** using passport-twitter, you must register an application with Twitter. If you have not already done so, a new application can be created at [Twitter Application Management](https://apps.twitter.com/). Your application will be issued a consumer key (API Key) and consumer secret (API Secret), which need to be provided to the strategy. You will also need to configure a callback URL which matches the route in your application.

After created a new Facebook and/or Twitter application, insert both id and secret strategy in the [auth.js](src/auth.js) module.

##PostgreSQL management
you can destroy gracefully the pg container running the command ```npm run pgdrop```. In addition, the script ```npm run pgsql``` launch the pg CLI so you can query the database content.






 