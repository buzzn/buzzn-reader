var chai = require('chai');
var expect = chai.expect;
var SmlParser = require('../libs/sml_parser');



it('does pars a easymeter ESY5Q3DA1004', function() {

  var sml = new SmlParser(
  "\n\
  /ESY5Q3DA1004 V3.04\n\
  \
  1-0:0.0.0*255(60327685)\n\
  1-0:1.8.0*255(00000000.6400000*kWh)\n\
  1-0:21.7.0*255(000000.10*W)\n\
  1-0:41.7.0*255(000002.00*W)\n\
  1-0:61.7.0*255(000000.50*W)\n\
  1-0:1.7.0*255(000000.00*W)\n\
  1-0:96.5.5*255(60)\n\
  0-0:96.1.255*255(1ESY1160327685)\n\
  !")


  expect(sml.manufacturerName).to.equal('easy_meter');
  expect(sml.productName).to.equal('5q3');
  expect(sml.meterSerialnumber).to.equal('60327685');
  expect(sml.energyAMilliwattHour).to.equal(640000);
  expect(sml.energyBMilliwattHour).to.equal(null);
  expect(sml.powerAMilliwatt).to.equal(2600);
  expect(sml.powerBMilliwatt).to.equal(null);
});




it('does pars a broken easymeter ESY5Q3DA1004 SML', function() {

  var sml = new SmlParser(
  "\n\
  ddd/ESY5Q3DA1004 V3.04\n\
  \
  1-0:0.0.0*255(60327685)\n\
  1-0:1.8.0*250000.6400000*kWh)\n\
  1-0:21.7.0*255(000000.10*W)\n\
  1-0:40*W)\n\
  1-0:61.7.0*25500000.00*W)\n\
  1-0:96.5.5*255(60)\n\
  0-0:96.1.255*255(1ESY1160327685)\n\
  !")


  expect(sml.manufacturerName).to.equal('easy_meter');
  expect(sml.productName).to.equal('5q3');
  expect(sml.meterSerialnumber).to.equal('60327685');
  expect(sml.energyAMilliwattHour).to.equal(null);
  expect(sml.energyBMilliwattHour).to.equal(null);
  expect(sml.powerAMilliwatt).to.equal(null);
  expect(sml.powerBMilliwatt).to.equal(null);
});




it('does pars a easymeter ESY5Q3DA1024 input', function() {

  var sml = new SmlParser(
  "/ESY5Q3DA1024 V3.04\n\
  \
  1-0:0.0.0*255(60328160)\n\
  1-0:1.8.0*255(00000001.3800000*kWh)\n\
  1-0:2.8.0*255(00000001.1400000*kWh)\n\
  1-0:21.7.0*255(000000.00*W)\n\
  1-0:41.7.0*255(000002.00*W)\n\
  1-0:61.7.0*255(000000.10*W)\n\
  1-0:1.7.0*255(000000.00*W)\n\
  1-0:96.5.5*255(00)\n\
  0-0:96.1.255*255(1ESY1160328160)\n\
  !")

  expect(sml.manufacturerName).to.equal('easy_meter');
  expect(sml.productName).to.equal('5q3');
  expect(sml.meterSerialnumber).to.equal('60328160');
  expect(sml.energyAMilliwattHour).to.equal(1380000);
  expect(sml.energyBMilliwattHour).to.equal(1140000);
  expect(sml.powerAMilliwatt).to.equal(2100);
  expect(sml.powerBMilliwatt).to.equal(0);
});




it('does pars a easymeter ESY5Q3DA1024 output', function() {

  var sml = new SmlParser(
  "/ESY5Q3DA1024 V3.04\n\
  \
  1-0:0.0.0*255(60328160)\n\
  1-0:1.8.0*255(00000001.3800000*kWh)\n\
  1-0:2.8.0*255(00000001.1400000*kWh)\n\
  1-0:21.7.0*255(-001000.00*W)\n\
  1-0:41.7.0*255(000002.00*W)\n\
  1-0:61.7.0*255(000000.10*W)\n\
  1-0:1.7.0*255(000000.00*W)\n\
  1-0:96.5.5*255(00)\n\
  0-0:96.1.255*255(1ESY1160328160)\n\
  !")

  expect(sml.manufacturerName).to.equal('easy_meter');
  expect(sml.productName).to.equal('5q3');
  expect(sml.meterSerialnumber).to.equal('60328160');
  expect(sml.energyAMilliwattHour).to.equal(1380000);
  expect(sml.energyBMilliwattHour).to.equal(1140000);
  expect(sml.powerAMilliwatt).to.equal(0);
  expect(sml.powerBMilliwatt).to.equal(997900);
});





it('does pars a easymeter ESY5Q3DA3004 output', function() {

  var sml = new SmlParser(
  "/ESY5Q3DA3004 V3.04\n\
  \
  1-0:0.0.0*255(60300829)\n\
  1-0:1.8.0*255(00000000.3600000*kWh)\n\
  1-0:21.7.0*255(000000.00*W)\n\
  1-0:41.7.0*255(-1000.00*W)\n\
  1-0:61.7.0*255(000300.00*W)\n\
  1-0:1.7.0*255(000000.00*W)\n\
  1-0:96.5.5*255(00)\n\
  0-0:96.1.255*255(1ESY1160300829)\n\
  !")

  expect(sml.manufacturerName).to.equal('easy_meter');
  expect(sml.productName).to.equal('5q3');
  expect(sml.meterSerialnumber).to.equal('60300829');
  expect(sml.energyAMilliwattHour).to.equal(360000);
  expect(sml.energyBMilliwattHour).to.equal(null);
  expect(sml.powerAMilliwatt).to.equal(700000);
  expect(sml.powerBMilliwatt).to.equal(null);
});






it('does pars a easymeter ESY5Q3DA3024', function() {

  var sml = new SmlParser(
  "/ESY5Q3DA3024 V3.04\n\
  \
  1-0:0.0.0*255(60118474)\n\
  1-0:1.8.0*255(00000002.0700000*kWh)\n\
  1-0:2.8.0*255(00000001.6900000*kWh)\n\
  1-0:21.7.0*255(000000.00*W)\n\
  1-0:41.7.0*255(000000.00*W)\n\
  1-0:61.7.0*255(000000.00*W)\n\
  1-0:1.7.0*255(000000.00*W)\n\
  1-0:96.5.5*255(00)\n\
  0-0:96.1.255*255(1ESY1160118474)\n\
  !")

  expect(sml.manufacturerName).to.equal('easy_meter');
  expect(sml.meterSerialnumber).to.equal('60118474');
  expect(sml.energyAMilliwattHour).to.equal(2070000);
  expect(sml.energyBMilliwattHour).to.equal(1690000);
  expect(sml.powerAMilliwatt).to.equal(0);
  expect(sml.powerBMilliwatt).to.equal(0);
});







it('does pars a easymeter ESY5T3DC1004', function() {

  var sml = new SmlParser(
  "/ESY5T3DC1004 V1.01\n\
  \
  1-0:0.0.0*255(60009501)\n\
  1-0:1.8.0*255(00000001.100000000*kWh)\n\
  1-0:21.7.0*255(000000.00*W)\n\
  1-0:41.7.0*255(000000.01*W)\n\
  1-0:61.7.0*255(000000.00*W)\n\
  1-0:1.7.0*255(00000001.100000000000.00*W)\n\
  1-0:96.5.5*255(00)\n\
  0-0:96.1.255*255(1ESY1160009501)\n\
  !")

  expect(sml.manufacturerName).to.equal('easy_meter');
  expect(sml.productName).to.equal('5t3');
  expect(sml.meterSerialnumber).to.equal('60009501');
  expect(sml.energyAMilliwattHour).to.equal(1100000);
  expect(sml.energyBMilliwattHour).to.equal(null);
  expect(sml.powerAMilliwatt).to.equal(10);
  expect(sml.powerBMilliwatt).to.equal(null);
});





it('does pars a easymeter ESY5T3DC1024', function() {

  var sml = new SmlParser(
  "/ESY5T3DC1024 V1.01\n\
  \
  1-0:0.0.0*255(60300856)\n\
  1-0:1.8.0*255(00000001.100000000*kWh)\n\
  1-0:2.8.0*255(00000001.000000000*kWh)\n\
  1-0:21.7.0*255(000003.83*W)\n\
  1-0:41.7.0*255(000000.00*W)\n\
  1-0:61.7.0*255(000000.00*W)\n\
  1-0:1.7.0*255(000003.83*W)\n\
  1-0:96.5.5*255(00)\n\
  0-0:96.1.255*255(1ESY1160300856)\n\
  !")

  expect(sml.manufacturerName).to.equal('easy_meter');
  expect(sml.productName).to.equal('5t3');
  expect(sml.meterSerialnumber).to.equal('60300856');
  expect(sml.energyAMilliwattHour).to.equal(1100000);
  expect(sml.energyBMilliwattHour).to.equal(1000000);
  expect(sml.powerAMilliwatt).to.equal(3830);
  expect(sml.powerBMilliwatt).to.equal(0);
});










it('does pars a hager HAG5eHZ010C_EHZ1ZA22', function() {

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
  expect(sml.manufacturerName).to.equal('hager');
  expect(sml.productName).to.equal('ehz');
  expect(sml.meterSerialnumber).to.equal('1095100000053019');
  expect(sml.energyAMilliwattHour).to.equal(16986200);
  expect(sml.energyBMilliwattHour).to.equal(1574000);
  expect(sml.powerAMilliwatt).to.equal(29000);
  expect(sml.powerBMilliwatt).to.equal(0);
});
