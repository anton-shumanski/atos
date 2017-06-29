# Atos Framework

  Easy to use, based on Express, supports ES6, common validation for client and server side.

## How to install it

```markdownd
npm install atos -g
```

## How to create your app

```markdownd
atos-cli new myApp
```
If already existed files should be overwritten, there is an additional parameter which must be used - `--overwrite`

## How to run your app

On development server:
```markdownd
cd myApp

atos-dev-server run
```
On production server:
```markdownd
cd myApp

atos-prod-server run
```
`atos-prod-server` command uses already compiled code to ES5 while `atos-dev-server` uses babel to interprete ES6

If you do not want to see the framework logs, use the option `--silent`
If you want to set different port then default(3000) you can add param `--port=XXXX`

## Configuration

  All configuration files are located in `configs` folder. At first application should be created and then the folder will look on following way:
 ```markdownd
configs
  -development
    -database.json
  -middleware
    -default.json
    -policy.json
    -validation.json
  -production
  -env.json.sample
  -defailt.json
  -events.json
  -navigation.json
  ```
  The main `configs` directory contains `production`, `development` and some other folders and json files. The files and folders placed in `production`/`development` inherit the files and folders in the main `configs` folder. So if you have file `database.json` in `development` folder and file with the same name in main `configs` folder - the file in `development` folder will inherit the file in the main folder (if we use development mode of course).
 
  It is often helpful to have different configuration values based on the environment where the application is running. For example, you may wish to use a different database configuration locally than you do on your production.

  You can do that by renaming the file named `env.json.sample`. to `env.json` and add next confuguration inside:
 ```markdownd
{
  "database": { /* this will overwrite the configuration in database.json file */
    ...
  }
}
```

  Your .env.json file should not be committed to your application's source control, since each developer / server using your application could require a different environment configuration.

  All additional files which you create in `configs` folder will be automatically loaded in the app configuration.

### Accessing Configuration Values

  You can get all app configurations with next code:
```markdownd
atos.app.get('config')
```
or if you have access to request object, you can get the config in this way:
```markdownd
req.app.get('config')
```
  There are few useful built in variables:
```markdownd
atos.app.get('rootPath')     - return the path to your app
atos.app.get('sourcePath')   - return the path to the source code(it can be path to src folder in dev mode or to src-es5 folder in prod mode)
atos.app.get('isProduction') - return true/false if the app is run in prod or in dev mode
atos.app.get('isSilentMode') - return true/false if app is run in silent mode
```
  If you need to access some property (e.g.`exampleProperty`) in the `default.json` file in the main `configs` folder, type the following code:
```markdownd
atos.app.get('config').exampleProperty
```
but if you need to access some property in the `database.json` file you should do it as follows:
```markdownd
atos.app.get('config').database.exampleProperty
```

## Request

Request objects is the same like request object in Express. There is some extra data appended to the request. The data is:
```markdownd
req.target.controller -> name of called controller
req.target.action     -> name of called action
req.wantsJson         -> if request wants response in json format
```

## Response

Response object is the same like request object in Express.

I added some default responses like `badRequest`, `forbidden`, `notFound`, `serverError` which can be send to the client.
You can see them at myApp/src/responses folder.

If you want to add some extra responses you can do that just by adding a new file at `responses` folder and the response will be automatically
loaded. The filename is equal to the method which you should call from response object.
For example if you add file `ok.js` in responses folder you can call it by `res.ok()`

## Routes

The main router class is myApp/src/routes/Router.js
In the `load` method you can define the main route for every controller, for example:
```markdownd
this.app.use('/account', account(this.app, this.middleware));
```
So for route `/account` we call method `account` where we describe all sub-routes for controller `AccountController`
Method `account` is defined in separate file in the same folder. The file name is `account.js`
For example in the file `account.js` we have:
```markdownd
const router = express.Router();

module.exports = function index(app, middleware) {
  router.route('/account/profile').get(...middleware.load('AccountController.getProfile'));
  return router;
};

```

Good practise is for `GET` http requests to use prefix `get` for method like `getProfile` and the same logic for `POST` http requests.

## Controllers

Controllers are responsible for responding to requests. They should not contain the bulk of your project’s business logic. Project’s business logic should be in `domain` folder.
Controllers are defined at `myApp/src/controllers` folder.

Good practise is the filenames to have suffix `Controller` (e.g. `AccountController`)

The controller it looks like that:
```markdownd
module.exports = {
    getIndex: function(req, res, next) {
        res.render('account/index');
    },

    getProfile:  function(req, res){
        res.render('account/profile', { user: req.user });
    }
}
```

## Models & ORM

Atos framework use <a href="http://docs.sequelizejs.com/">Sequelize</a> ORM. You can read how to use it <a href="http://docs.sequelizejs.com/">here</a>.
Atos framework also supports multiple database connections.
You can add your db configurations at (development/production)/database.json
Next step is to create file at `myApp/src/models/db/` The key thing is that the filename should be equal to the key which you set in `database.json`

The database.json can looks as follows:
```markdownd
{
    "main": {
        "database": "test",
        "username": "root",
        "password": "",
        "config": {
            "host": "localhost",
            "dialect": "mysql",

            "pool": {
                "max": 5,
                "min": 0,
                "idle": 10000
            }
        }
    }
}
```
In our case the filename in `myApp/src/models/db/` should be `main.js` and it looks as follows:
```markdownd
const modelPath = atos.app.get('sourcePath')+'models/';
const db = new atos.dbConnection(__filename, modelPath);

module.exports = function () {
    return db.connect();
}
```
So you can use db connection in the next way:
```markdownd
import models from '....../models/db/main'

models().User.findOne({
            where: {
                email: 'test-email',
            }
        }).then(user => {
            if (!user) {
                return console.log('Cannot find user')
            }

            return user;
        }).catch(err => {
            return cb(err);
        });
```

## Views

For views the framework uses EJS and `express-ejs-layouts` module for layouts.
You can see how to use ejs <a href="http://www.embeddedjs.com/">here</a>
Files related to the view are located at `myApp/views`
## Frontend javascript

If you want to add specific js file to any view you can append next code to view file:
```markdownd
<script src="/js/paht_to_your_view_file.js"></script>
```
The script will be appended before end of a `</body>` tag

Atos Framework has mechanism for loading specific js file for every action
For example if you make request to '/account/profile' and the controller is `myApp/src/controllers/AccountController` and the method is `getProfile`
the js which will be loaded automatically if exists is `/public/js/actions/account/AccountProfile.js`

## Middleware
--middleware, policy, validation

## Validation

## Globals

## Sessions

## Crons

## Events & Listeners

## Defailt features
--authentication, navigation

## Included helpful packages
