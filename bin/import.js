var fs   = require('fs'),
    path = require('path'),
    exec = require('child_process').exec;
    execSync = require('child_process').execSync;

var importJSON = function(file_path, db_name, col_name) {
  file_path = path.resolve(file_path);
  var cmd = "mongoimport";
      cmd += " --type json --jsonArray";
      cmd += " --db " + db_name;
      cmd += " --collection " + col_name;
      cmd += " --file \"" + file_path + '"';
  console.log(cmd);
  console.log(execSync(cmd));
}

console.log(process.env.DATA_DIR || process.argv[2] || '/Users/kenta/Downloads/keitalab Slack export Jul 22 2015');
DATA_DIR = path.resolve(process.env.DATA_DIR || process.argv[2] || '/Users/kenta/Downloads/keitalab Slack export Jul 22 2015');
DB_NAME = process.env.DB_NAME || 'slack';

// import user
importJSON(DATA_DIR+"/users.json", DB_NAME, "users");

// get channel
channels = JSON.parse(fs.readFileSync(DATA_DIR+"/channels.json"));
channels.forEach(function(e) {
  channel_path = DATA_DIR+"/"+e["name"];
  console.log(channel_path);

  var files = fs.readdirSync(channel_path);
  files.forEach(function(f) {
    console.log(channel_path+"/"+f);
    importJSON(channel_path+"/"+f, DB_NAME, e["name"]);
  });
});
