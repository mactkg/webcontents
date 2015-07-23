var MongoClient = require('mongodb').MongoClient;

var db;

MongoClient.connect("mongodb://localhost:27017/slack", function(err, _db) {
  db = exports.db = _db;
  console.log(db);
});

exports.getStats = function(channelName, type) {
  type = type || "monthly";

  var map = function() {
    var date = this._id;

    switch(type) {
      case "monthly":
        date.setUTCMonth(date.getUTCMonth(), 1);
      case "daily":
        date.setUTCHours(0);
      case "hourly":
        date.setUTCMinutes(0);
      case "minutely":
        date.setUTCSeconds(0);
    };
    emit(date, this.value);
  };

  var reduce = function(k, vs) {
    var data = {
      count: 0,
      users:{},
      channel:vs[0].channel
    };

    vs.forEach(function(v) {
      data.count += v.count;
      Object.keys(v.users).forEach(function(k) {
        data.users[k] = data.users[k] || 0;
        data.users[k] += v.users[k];
      });
    });

    return data;
  };

  return new Promise(function(resolve, reject) {
    db.collection("statistics", function(err, col) {
      col.mapReduce(map, reduce, {query: {"value.channel": channelName}, sort:{"_id":1}, out: {inline: 1}, scope: {type: type}}, function(err, result){
        if(err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  });
};
