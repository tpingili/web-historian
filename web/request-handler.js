var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require("url");
// require more modules/folders here!
var httpHelpers = require('./http-helpers');

exports.handleRequest = function (request, response) {
  var pathname = httpHelpers.getPathName(request);
  var siteName = pathname.substr(1);
  //if it's not / and url is in our list
  if(request.method === "GET"){
    if(!siteName){
      console.log("if site is /");
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
              exports.serveIndex(request,response, '/loading.html', 200);
            }
          });
        }else{
          exports.serveIndex(request,response, '/', 404);
        }
      });
    }
  } else {
      httpHelpers.collectData(request,function(data){
        archive.addUrlToList(data.slice(data.indexOf('=')+1), function(){
          exports.serveIndex(request,response, '/', 302);
        });
      })



    // archive.isUrlInList(siteName, function(inList){
    //   if(!inList){
    //     archive.isURLArchived(siteName, function(isArchive){
    //       if(!isArchive){

    //       }
    //     })
    //   }
    // })
  }
};
exports.serveIndex = function(request, response, pathname, statusCode){
  pathname = pathname === "/" ? "/index.html" : pathname;
      console.log("status code in serveIndex:" +statusCode);

  httpHelpers.serveAssets(response, pathname, httpHelpers.sendResponse, statusCode );
};

