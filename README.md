# node-passport-local-mysql

The main goal of app was to crate a dashboard to handle mysql(MariaDB) database. The app contains user login and registration made with node.js, express, ejs, express-session, express-mysql-session, mysql, passport(local strategy) and some other packages.

## Setup

To run this project, make following steps :

```
$ npm install
```

Create .env file and variables in it: 'PORT' and 'SESSION_SECRET'
example:

```
PORT = 3000
SESSION_SECRET = verySecretString
```

And finally:

```
$ npm run start
```
