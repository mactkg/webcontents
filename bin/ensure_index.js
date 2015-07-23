var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/slack", function(err, db) {
  db.collections(function(err, cols) {
    cols.forEach(function(col) {
      col.ensureIndex({id:1});
      if(col.collectionName == "users") {
        col.ensureIndex({name:1});
      } else if(col.collectionName == "channels") {
        return;
      } else {
        col.ensureIndex({name:1});
        col.ensureIndex({ts:1});
      }
      
      col.indexes(function(err, indexes) {
        console.log(col.collectionName);
        console.log(indexes);
      });
    });
  });
});
