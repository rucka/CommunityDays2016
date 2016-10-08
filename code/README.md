#Code
The demo shows how to build in five steps the node.js backend APIs consumed by the [Vanilla JS](http://todomvc.com/examples/vanillajs) version of the [Todo](http://todomvc.com) single page application:

- [step 1](step1): hello world
- [step 2](step2): modules and APIs
- [step 3](step3): web framework (Express)
- [step 4](step4): database (Knex)
- [step 5](step5): authentication and authorization (Passport)


In addition, there are other two demos showing how to [unit test the express application](demo) and how to [dockerize the app node](docker).

##Structure of the step
Starting from the [step 3 demo](step3) each project has the same folder structure:

- .vscode: Visual Studio Code settings (ignore or delete the folder if you plan to use an other editor)
- public: the Todo single page application
- specs: the single page application ensuring that the api works as expected by the Todo SPA
- src: the server side code of the application
- views: the server side jade templates of the application

##References

- [TodoMVC](http://todomvc.com) - Helping you select an MV* framework
- [Todo-Backend](http://www.todobackend.com) - a shared example to showcase backend tech stacks