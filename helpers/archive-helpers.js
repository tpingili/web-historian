var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var path = require('path');
var _ = require('underscore');
var htmlfetcher = require('../workers/htmlfetcher');

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt'),
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

exports.readListOfUrls = function(callback){
  var instream = fs.createReadStream(exports.paths.list);
  var outstream = new stream;
  var rl = readline.createInterface(instream, outstream);
  var list = [];
  rl.on('line', function(line) {
    list.push(line);
  });
  rl.on('close', function() {
    // do something on finish here
    return callback(list);
  });
};

exports.isUrlInList = function(url, callback){
  //find url in sites.txt
  var _url = url;
  return exports.readListOfUrls(function(urlArray){
    return callback(_.contains(urlArray, _url));
  });
};

exports.addUrlToList = function(url, callback){
  fs.appendFile(exports.paths.list, url + "\n", function (err) {
    if (err) throw err;
    callback();
  });
};

exports.isURLArchived = function(url, callback){
  //this is called when the data from the html is loaded into the file
  //and that file is written into archives/sites/filename
  //
  //Tells us if the archive exists
  return fs.open(exports.paths.archivedSites+"/"+url,'r',function(err, fd){
    if (err) {
      return callback(false);
    }
    return callback(true);
  });
};

exports.downloadUrls = function(){
  htmlfetcher.getUrlsContent();
};
