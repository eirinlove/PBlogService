const express = require('express');
var router = require('express').Router();
router.use('/public', express.static('public'));

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(process.env.DB_URL, function(err, client){
        database = client.db('todoapp');

});

module.exports = router;