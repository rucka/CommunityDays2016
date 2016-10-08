#Step 4 - Database access using knex

##Build and Run
- run ```node install``` to install all external application and development dependences
- run ```npm run compile``` to transpile the code using [babel](https://babeljs.io)
- run ```npm run pgstart``` to start postgreSQL inside a docker container
- run ```npm run dev``` to launch the application
- open your browser and go to http://localhost:8000/home

###Note
the command ```npm run dev``` launches the application through [nodemon](http://nodemon.io) so the server will be restarted when the code changed (hot reload).

##Dependencies
You need docker up and running to start the database server. Please refer the docker [website](http://www.docker.com/products/overview) if you need to install docker.


##PostgreSQL management
you can destroy gracefully the pg container running the command ```npm run pgdrop```. In addition, the script ```npm run pgsql``` launch the pg CLI so you can query the database content.






 