var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require("url");
// require more modules/folders here!
var httpHelpers = require('./http-helpers');

exports.handleRequest = function (request, response) {
  var pathname = httpHelpers.getPathName(request);
  var siteName = pathname.substr(1);
  //if it's not / and url is in our list
  if(!siteName){
    console.log("if 1");
    exports.serveIndex(request, response, pathname);
  }else{
    archive.isUrlInList(siteName, function(inList){
      if(inList){
        console.log("if url is in the list");
        //is url archived
        archive.isURLArchived(siteName,function(isArchive){
          if(isArchive){
            console.log("if url is archived and ready to display");
            //redirect to send user the archived site
            exports.serveIndex(request,response, pathname);
          } else{
            console.log("if url is not archived but is in the list");
            //else direct to loading
            exports.serveIndex(request,response, '/loading.html');
          }
        });
      }else{
        console.log("if url is not in the list");
        //if its not, add url to list
        archive.addUrlToList(pathname);
        //and redirect to loading page
        exports.serveIndex(request,response, '/loading.html');
      }
    });
  }
};
exports.serveIndex = function(request, response, pathname){
  pathname = pathname === "/" ? "/index.html" : pathname;
  httpHelpers.serveAssets(response, pathname, httpHelpers.sendResponse );
};
