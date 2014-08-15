var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var httpHelpers = require('./http-helpers');


exports.handleRequest = function (request, response) {
  var pathname = httpHelpers.getPathName(request);
  //if it's not / and url is in our list
  if(request.method === 'GET'){
    if(pathname === '/'){
      exports.servePage(request, response, pathname);
    } else{
      console.log("pathname:" +pathname);
      exports.routeBasedOnList(pathname, request, response, request.method);
    }
  }else if(request.method === 'POST'){
    httpHelpers.collectData(request,function(data){
      exports.routeBasedOnList(data, request, response, request.method);
    });
  }else if(request.method === 'PUT' && pathname === '/'){
    archive.downloadUrls();
    exports.servePage(request,response, '/', 200);
  }
};


exports.servePage = function(request, response, pathname, statusCode){
  pathname = pathname === '/' ? '/index.html' : pathname;
  httpHelpers.serveAssets(response, pathname, httpHelpers.sendResponse, statusCode );
};


exports.routeBasedOnList = function(data,request,response,method){
  var formattedData = method === 'GET' ? data.slice(data.indexOf('/') + 1) :data.slice(17);
  archive.isUrlInList(formattedData, function(inList){
    exports.serveIfContained(inList, request, response, formattedData, method);
  });
};


exports.serveIfContained = function(hasSite, request, response, data, method){
  if(!hasSite){
    if(method === 'GET'){
      exports.servePage(request,response, '/', 404);
    } else {
      archive.addUrlToList(data, function(){
        exports.servePage(request,response, '/loading.html', 302);
      });
    }
  } else {
    archive.isURLArchived(data,function(isArchive){
      if(isArchive){
        //redirect to send user the archived site
        exports.servePage(request,response, '/'+data, 200);
      }else{
        //else direct to loading
        exports.servePage(request,response, '/loading.html', 302);
      }
    });
  }

};
