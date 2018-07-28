var express = require('express');
var router = express.Router();

var neo4j = require('../models/neo4j');

/* GET home page. */
router.get(':category', function(req, res, next) {
    neo4j.listAll().then(val => {
        res.render('index', {nodes: val});
    });
  //res.render('index', { title: 'Express' });
});

module.exports = router;
