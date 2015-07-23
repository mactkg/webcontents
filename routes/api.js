var express = require('express'),
    stats   = require('../lib/stats');
var router = express.Router();

router.get('/channels', function(req, res, next) {
  stats.getChannels().then(function(channels) {
    res.json(channels);
  });
});

router.get('/channels/:name/stats', function(req, res, next) {
  stats.getChannelStats(req.params.name, req.query.type)
    .then(function(data) {
      res.json(data);
    });
});

router.get('/channels/stats', function(req, res, next) {
  stats.getAllChannelStats(req.query.type).then(function(data) {
    res.json(data);
  });

});

router.get('/users', function(req, res, next) {
  stats.getUsers().then(function(users) {
      res.json(users);
    });
});

module.exports = router;
