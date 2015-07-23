var fs       = require('fs'),
    path     = require('path'),
    db       = require('../lib/db.js');

console.log(process.env.DATA_DIR || process.argv[2] || '/Users/kenta/Downloads/keitalab Slack export Jul 22 2015');
DATA_DIR = path.resolve(process.env.DATA_DIR || process.argv[2] || '/Users/kenta/Downloads/keitalab Slack export Jul 22 2015');
DB_NAME = process.env.DB_NAME || 'slack';

// import user
console.log(db.importJSON(DATA_DIR+"/users.json", DB_NAME, "users").toString());

// get channel
channels = JSON.parse(fs.readFileSync(DATA_DIR+"/channels.json"));
channels.forEach(function(e) {
  channel_path = DATA_DIR+"/"+e["name"];
  console.log(channel_path);

  var files = fs.readdirSync(channel_path);
  files.forEach(function(f) {
    console.log(channel_path+"/"+f);
    console.log(db.importJSON(channel_path+"/"+f, DB_NAME, e["name"]).toString());
  });
});
