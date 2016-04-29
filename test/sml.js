var chai = require('chai');
var expect = chai.expect;
var SmlParser = require('../libs/sml_parser');


it('does pars a easymeter q3d SML', function() {

  var sml = new SmlParser(
  "/ESY5Q3DA1004 V3.02\n\
  \
  1-0:0.0.0*255(1003003416)\n\
  1-0:1.8.0*255(00000000.9000000*kWh)\n\
  1-0:21.7.255*255(000000.00*W)\n\
  1-0:41.7.255*255(-000008.82*W)\n\
  1-0:61.7.255*255(000000.00*W)\n\
  1-0:1.7.255*255(-000008.82*W)\n\
  1-0:96.5.5*255(D2)\n\
  0-0:96.1.255*255(1ESY1003003416)\n\
  !")

  expect(sml.meterSerialnumber).to.equal('1003003416');
  expect(sml.wattHourA).to.equal(900);
  expect(sml.wattHourB).to.equal(null);
  expect(sml.power).to.equal(-8.82);
});



it('does pars a hager EHZ SML', function() {

  var sml = new SmlParser(
  "/HAG5eHZ010C_EHZ1ZA22\n\
  0:0.0.0*255(1095100000053019)\n\
  1-0:1.8.1*255(000016.9862)\n\
  1-0:2.8.1*255(000001.5740)\n\
  1-0:96.5.5*255(80)\n\
  0-0:96.1.255*255(0000053019)\n\
  1-0:32.7.0*255(000.00*V)\n\
  1-0:52.7.0*255(000.00*V)\n\
  1-0:72.7.0*255(226.99*V)\n\
  1-0:31.7.0*255(000.00*A)\n\
  1-0:51.7.0*255(000.00*A)\n\
  1-0:71.7.0*255(000.22*A)\n\
  1-0:21.7.0*255(+00000*W)\n\
  1-0:41.7.0*255(+00000*W)\n\
  1-0:61.7.0*255(+00029*W)\n\
  1-0:96.50.0*0(89)\n\
  1-0:96.50.0*1(07CF)\n\
  1-0:96.50.0*2(18)\n\
  1-0:96.50.0*3(0E)\n\
  1-0:96.50.0*4(2D)\n\
  1-0:96.50.0*5(1A)\n\
  1-0:96.50.0*6(003D381B2609F5400803010700009F80)\n\
  1-0:96.50.0*7(00)\n\
  !")

  expect(sml.meterSerialnumber).to.equal('1095100000053019');
  expect(sml.wattHourA).to.equal(16986);
  expect(sml.wattHourB).to.equal(1574);
  expect(sml.power).to.equal(29);
});
