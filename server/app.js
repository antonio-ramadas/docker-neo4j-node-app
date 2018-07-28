var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

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

    let f = hasParameter ? neo4j.listFromCategory : neo4j.listAll;

    let arg = hasParameter ? req.params[0] : undefined;

    f(arg).then(
        val => res.render('index', {nodes: val}),
        // TODO The error code is not very precise (it is not checked the true reason)
        error => next(createError(400)));
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
