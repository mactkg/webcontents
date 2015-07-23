var path     = require('path'),
    exec     = require('child_process').exec,
    execSync = require('child_process').execSync;

exports.importJSON = function(file_path, db_name, col_name) {
  file_path = path.resolve(file_path);
  var cmd = "mongoimport";
      cmd += " --type json --jsonArray";
      cmd += " --db " + db_name;
      cmd += " --collection " + col_name;
      cmd += " --file \"" + file_path + '"';
  return execSync(cmd);
};
