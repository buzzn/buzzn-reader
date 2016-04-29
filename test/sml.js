var chai = require('chai');
var expect = chai.expect;
var fs = require('fs');
var SmlParser = require('../libs/sml_parser');


var easymeterQ3dSML = "";
fs.readFile('test/fixtures/easymeter_q3d.sml', function(err, data) {
  easymeterQ3dSML = data.toString();
});

var hagerEHZSML = "";
fs.readFile('test/fixtures/hager_ehz.sml', function(err, data) {
  hagerEHZSML = data.toString();
});




it('does get the power from easymeter q3d sml', function() {
  var smlParser = new SmlParser(easymeterQ3dSML);
  console.log(smlParser.power);
});

it('does get the wattHour from easymeter q3d sml', function() {
  var smlParser = new SmlParser(easymeterQ3dSML);
  console.log(smlParser.wattHour);
});

it('does get the power from hager EHZ sml', function() {
  var smlParser = new SmlParser(hagerEHZSML);
  console.log(smlParser.power);
});

it('does get the wattHour from hager EHZ sml', function() {
  var smlParser = new SmlParser(hagerEHZSML);
  console.log(smlParser.wattHour);
});
