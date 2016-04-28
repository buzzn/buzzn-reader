var chai = require('chai');
var expect = chai.expect;
var fs = require('fs');
var SmlParser = require('../libs/sml_parser');


var easymeterQ3dSML = "";
fs.readFile('test/fixtures/easymeter_q3d.sml', function(err, data) {
  easymeterQ3dSML = data.toString();
});




it('does pars the easymeter q3d sml', function() {
  var smlParser = new SmlParser(easymeterQ3dSML);
  console.log(smlParser.smlHeader);
});
