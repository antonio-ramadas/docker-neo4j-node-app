var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

var neo4j = require('./models/neo4j');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/*', (req, res, next) => {
    let hasParameter = req.params[0].length > 0;

    let f = neo4j.listAll;
    let arg = undefined;

    if (hasParameter) {
        f = neo4j.listFromCategory;
        arg = req.params[0];
    }

    f(arg).then(
        val => res.render('index', {nodes: val}),
        // It was not able to connect to the database
        error => next(createError(500)));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
