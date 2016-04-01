(function(){
  
  var utils = require('../lib/GenstringUtils');
  
  module.exports = {
    "attributes": {
      "translationKeys": {
        // MethodNamed<"tr">
        "TMLLocalizedString": function(meth) {
          var key = null;
          var result = meth.translationKeys;
          if (result instanceof Array) {
            var label = (result[0]) ? result[0].label : null;
            var description = (result[1]) ? result[1].label : null;
            key = utils.createTranslationKey(label, description);
          }
          else if (result && result.label) {
            key = result;
          }
          debugger;
          return key;
        }
      }
    }
  }

})();