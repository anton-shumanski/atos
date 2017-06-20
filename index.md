# Atos Framework

  Easy to use, based on Express, supports ES6, common validation for client and server side.

## How to install it

```markdownd
npm install atos -g
```

## How to create your app

```markdownd
atos new myApp
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
hermes.app.get('config')
```
or if you have access to request object, you can get the config in this way:
```markdownd
req.app.get('config')
```
  There are few useful built in variables:
```markdownd
hermes.app.get('rootPath')     - return the path to your app
hermes.app.get('sourcePath')   - return the path to the source code(it can be path to src folder in dev mode or to src-es5 folder in prod mode)
hermes.app.get('isProduction') - return true/false if the app is run in prod or in dev mode
hermes.app.get('isSilentMode') - return true/false if app is run in silent mode
```
  If you need to access some property (e.g.`exampleProperty`) in the `default.json` file in the main `configs` folder, type the following code:
```markdownd
hermes.app.get('config').exampleProperty
```
but if you need to access some property in the `database.json` file you should do it as follows:
```markdownd
hermes.app.get('config').database.exampleProperty
```

## Request

## Response

## Routes

## Controller

## Models & ORM

## Views

## Frontend javascript

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
