var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var url = require("url");

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback, statusCode) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
  var path = "";
  archive.isUrlInList(asset.substr(1), function(inList){
    if(inList){
      path = archive.paths.archivedSites;

    }else{
      path = archive.paths.siteAssets;

    }
    fs.readFile(path + asset, function(err, data){
      if(err){
        throw err;
      }
      callback(res, data, statusCode);
    });
  });
};

exports.sendResponse = function(response, data, statusCode){
  statusCode = statusCode || 200;
  response.writeHead(statusCode, exports.headers);
  response.end(data);
};
exports.getPathName = function(request){
  return url.parse(request.url).pathname;
};

exports.collectData = function(request, callback){
  var msg = "";
  request.on('data', function(chunk){
    msg += chunk;
  });
  request.on('end', function(){
    callback(msg);
  });
};
