var MongoClient = require('mongodb').MongoClient;


var m = function() {
  var date = new Date(this.ts * 1000);
  date.setSeconds(0);
  var key = {
    date: date
  };

  var value = {
    user: this.user,
    type: this.type
  }

  emit(date, value);
};

var r = function(key, values) {
  var sum = 0;
  var users = {};
  values.forEach(function(v) {
    var user = v.user;
    if(users[user] == undefined) {
      users[user] = 1;
    } else {
      users[user] += 1;
    }
    sum += 1;
  });
  return {count: sum, users: users, channel: channel};
};

var f = function(key, value) {
  if(value.users == undefined) {
    var data = {count: 1, users: {}, channel: channel};
    data.users[value.user] = 1;
    return data;
  } else {
    return value;
  }
};

MongoClient.connect("mongodb://localhost:27017/slack", function(err, db) {
  db.collections(function(err, cols) {
    cols.forEach(function(col) {
      var name = col.collectionName;
      if(name == "rss" || name == "system.indexes" || name == "statistics" || name == "users") {
        return;
      }
      col.mapReduce(m, r, {out: {merge: 'statistics'}, finalize: f, scope: {channel: col.collectionName}}, function(err, result){
        console.log(col.collectionName);
      });
    });
  });
});
