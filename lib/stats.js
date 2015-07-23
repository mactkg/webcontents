var MongoClient = require('mongodb').MongoClient;

var db;

MongoClient.connect("mongodb://localhost:27017/slack", function(err, _db) {
  db = exports.db = _db;
});

exports.getAllChannelStats = function(type) {
  return db.collections().then(function(cols) {
    return Promise.all(
      cols.map(function(col) {
        return col.collectionName;
      }).filter(function(name) {
        return !(name == "rss" || name == "system.indexes" || name == "statistics" || name == "users")
      }).map(function(name) {
        console.log(name);
        return exports.getChannelStats(name, type);
      })
    );
  });
};

exports.getChannelStats = function(channelName, type) {
  type = type || "weekly";

  var map = function() {
    var date = new Date(0);
    if(type == "monthly") {
      date.setUTCMonth(this._id.getUTCMonth());
    } else if(type == "hourly") {
      date.setUTCHours(this._id.getUTCHours());
    } else if(type == "weekly") {
      date = this._id.getDay();
    }
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

exports.getChannels = function() {
  return db.collections().then(function(cols) {
    return cols.map(function(col) {
      return col.collectionName;
    }).filter(function(name) {
      return !(name == "rss" || name == "system.indexes" || name == "statistics" || name == "users");
    });
  });
};

exports.getUsers = function() {
  return new Promise(function(resolve, reject){
    db.collection("users", function(err, col) {
      col.find().toArray()
        .then(resolve, reject);
    });
  });
};
