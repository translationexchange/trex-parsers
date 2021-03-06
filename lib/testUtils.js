(function(){
  var Path = require('path');
  var FS = require('fs');
  var Logger = require(__dirname + '/logger.js').sharedLogger;
  var GitHubGopher = require(__dirname + '/gitHubGopher.js');
  var GSUtils = require(__dirname + "/utils.js");
  var mkdirp = require('mkdirp');
  
  var gopher = null;
  
  function fetchSamplesFromGitHub(query, sampleSize, destination, callback, _startPage) {
    if (!gopher) {
      var accessToken = global['githubToken'];
      gopher = new GitHubGopher(accessToken);
    }
    var foundSamples = 0;
    gopher.on("repos.getContent", function(result) {
      if (result) {
        var fName = result.path;
        var fContent = new Buffer(result.content, result.encoding);
        var repo = result.repository;
        var repoNameParts = result.download_url.split("/").splice(3,2);
        var outPathParts = [destination];
        if (repoNameParts) {
          outPathParts = outPathParts.concat(repoNameParts);
        }
        if (fName) {
          outPathParts = outPathParts.concat(fName.split("/"));
        }
        var outPath = Path.join.apply(Path, outPathParts);
        debugger;
        Logger.info("Writing " + outPath);
        var dirname = Path.dirname(outPath);
        if (!GSUtils.directoryExists(dirname)) {
          mkdirp.sync(dirname);
        }
        FS.writeFileSync(outPath, fContent);
        foundSamples++;
        if (foundSamples >= sampleSize) {
          debugger;
          gopher.end();
        }
      }
    });
    gopher.fetchContentMatchingQuery(query);
  }
  
  var TestUtils = {
    "fetchSamplesForLanguage": function fetchSamplesForLanguage(lang, sampleSize, destination, callback) {
      var macro = null;
      if (lang == "objc") {
        macro = "NSLocalizedString";
        lang = "Objective-C";
      }
      else if (lang == "swift") {
        macro = "NSLocalizedString";
      }
      if (!macro) {
        Logger.error("Don't know what macro to query for language '"+lang+"'");
        return;
      }
      fetchSamplesFromGitHub(macro + " language:" + lang, sampleSize, destination, callback);
    }
  };
  
  module.exports = TestUtils;
})()
