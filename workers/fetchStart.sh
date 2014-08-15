#!/usr/bin/env node
var request = require('request');
var archive = require("../helpers/archive-helpers");
var fs = require('fs');
archive.readListOfUrls(function(sites){
  sites.forEach(function(site){
        request.get('http://'+site).pipe(fs.createWriteStream(archive.paths.archivedSites + "/" + site));
  });
});
