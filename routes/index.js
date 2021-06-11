// Express is the open source web development framework for Node.Here user and index routes are already scafffolded by express generator, It allows users to create own public directories, routes, views
//Home page 
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
