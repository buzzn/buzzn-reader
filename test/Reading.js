const Reading = require('../libs/Reading');
const chai = require('chai');

var expect = chai.expect;

describe('Reading', () => {

    it('does pars a easymeter ESY5Q3DA1004', () => {

        let reading = new Reading(
            "\n\
    /ESY5Q3DA1004 V3.04\n\
    \
    1-0:0.0.0*255(60327685)\n\
    1-0:1.8.0*255(00000000.6400000*kWh)\n\
    1-0:21.7.0*255(000000.10*W)\n\
    1-0:41.7.0*255(000002.00*W)\n\
    1-0:61.7.0*255(000000.50*W)\n\
    1-0:1.7.0*255(000002.60*W)\n\
    1-0:96.5.5*255(60)\n\
    0-0:96.1.255*255(1ESY1160327685)\n\
    !")

        expect(reading.manufacturerName).to.equal('easy_meter');
        expect(reading.productName).to.equal('5q3');
        expect(reading.meterSerialnumber).to.equal('60327685');
        expect(reading.energyAMilliwattHour).to.equal(640000);
        expect(reading.energyBMilliwattHour).to.equal(null);
        expect(reading.powerAMilliwatt).to.equal(2600);
        expect(reading.powerBMilliwatt).to.equal(null);
        expect(reading.direction).to.equal('in');
    });



    it('does pars a broken easymeter ESY5Q3DA1004 SML', () => {

        let reading = new Reading(
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

        expect(reading.manufacturerName).to.equal('easy_meter');
        expect(reading.productName).to.equal('5q3');
        expect(reading.meterSerialnumber).to.equal('60327685');
        expect(reading.energyAMilliwattHour).to.equal(null);
        expect(reading.energyBMilliwattHour).to.equal(null);
        expect(reading.powerAMilliwatt).to.equal(null);
        expect(reading.powerBMilliwatt).to.equal(null);
        expect(reading.direction).to.equal(undefined);
    });





    it('does pars a easymeter ESY5Q3DA1024 input', () => {

        let reading = new Reading(
            "/ESY5Q3DA1024 V3.04\n\
    \
    1-0:0.0.0*255(60328160)\n\
    1-0:1.8.0*255(00000001.3800000*kWh)\n\
    1-0:2.8.0*255(00000001.1400000*kWh)\n\
    1-0:21.7.0*255(000000.00*W)\n\
    1-0:41.7.0*255(000002.00*W)\n\
    1-0:61.7.0*255(000000.10*W)\n\
    1-0:1.7.0*255(000002.10*W)\n\
    1-0:96.5.5*255(00)\n\
    0-0:96.1.255*255(1ESY1160328160)\n\
    !")

        expect(reading.manufacturerName).to.equal('easy_meter');
        expect(reading.productName).to.equal('5q3');
        expect(reading.meterSerialnumber).to.equal('60328160');
        expect(reading.energyAMilliwattHour).to.equal(1380000);
        expect(reading.energyBMilliwattHour).to.equal(1140000);
        expect(reading.powerAMilliwatt).to.equal(2100);
        expect(reading.powerBMilliwatt).to.equal(0);
        expect(reading.direction).to.equal('in_out');
    });




    it('does pars a easymeter ESY5Q3DA1024 output', () => {

        let reading = new Reading(
            "/ESY5Q3DA1024 V3.04\n\
    \
    1-0:0.0.0*255(60328160)\n\
    1-0:1.8.0*255(00000001.3800000*kWh)\n\
    1-0:2.8.0*255(00000001.1400000*kWh)\n\
    1-0:21.7.0*255(-001000.00*W)\n\
    1-0:41.7.0*255(000002.00*W)\n\
    1-0:61.7.0*255(000000.10*W)\n\
    1-0:1.7.0*255(-000997.90*W)\n\
    1-0:96.5.5*255(00)\n\
    0-0:96.1.255*255(1ESY1160328160)\n\
    !")

        expect(reading.manufacturerName).to.equal('easy_meter');
        expect(reading.productName).to.equal('5q3');
        expect(reading.meterSerialnumber).to.equal('60328160');
        expect(reading.energyAMilliwattHour).to.equal(1380000);
        expect(reading.energyBMilliwattHour).to.equal(1140000);
        expect(reading.powerAMilliwatt).to.equal(0);
        expect(reading.powerBMilliwatt).to.equal(997900);
        expect(reading.direction).to.equal('in_out');
    });





    it('does pars a easymeter ESY5Q3DA3004 output', () => {

        let reading = new Reading(
            "/ESY5Q3DA3004 V3.04\n\
    \
    1-0:0.0.0*255(60300829)\n\
    1-0:1.8.0*255(00000000.3600000*kWh)\n\
    1-0:21.7.0*255(000000.00*W)\n\
    1-0:41.7.0*255(-001000.00*W)\n\
    1-0:61.7.0*255(000300.00*W)\n\
    1-0:1.7.0*255(-000700.00*W)\n\
    1-0:96.5.5*255(00)\n\
    0-0:96.1.255*255(1ESY1160300829)\n\
    !")

        expect(reading.manufacturerName).to.equal('easy_meter');
        expect(reading.productName).to.equal('5q3');
        expect(reading.meterSerialnumber).to.equal('60300829');
        expect(reading.energyAMilliwattHour).to.equal(360000);
        expect(reading.energyBMilliwattHour).to.equal(null);
        expect(reading.powerAMilliwatt).to.equal(700000);
        expect(reading.powerBMilliwatt).to.equal(null);
        expect(reading.direction).to.equal('out');
    });






    it('does pars a easymeter ESY5Q3DA3024', () => {

        let reading = new Reading(
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

        expect(reading.manufacturerName).to.equal('easy_meter');
        expect(reading.meterSerialnumber).to.equal('60118474');
        expect(reading.energyAMilliwattHour).to.equal(2070000);
        expect(reading.energyBMilliwattHour).to.equal(1690000);
        expect(reading.powerAMilliwatt).to.equal(0);
        expect(reading.powerBMilliwatt).to.equal(0);
        expect(reading.direction).to.equal('in_out');
    });







    it('does pars a easymeter ESY5T3DC1004', () => {

        let reading = new Reading(
            "/ESY5T3DC1004 V1.01\n\
    \
    1-0:0.0.0*255(60009501)\n\
    1-0:1.8.0*255(00000001.100000000*kWh)\n\
    1-0:21.7.0*255(000000.00*W)\n\
    1-0:41.7.0*255(000000.01*W)\n\
    1-0:61.7.0*255(000000.00*W)\n\
    1-0:1.7.0*255(00000000.010000000000.00*W)\n\
    1-0:96.5.5*255(00)\n\
    0-0:96.1.255*255(1ESY1160009501)\n\
    !")

        expect(reading.manufacturerName).to.equal('easy_meter');
        expect(reading.productName).to.equal('5t3');
        expect(reading.meterSerialnumber).to.equal('60009501');
        expect(reading.energyAMilliwattHour).to.equal(1100000);
        expect(reading.energyBMilliwattHour).to.equal(null);
        expect(reading.powerAMilliwatt).to.equal(10);
        expect(reading.powerBMilliwatt).to.equal(null);
        expect(reading.direction).to.equal('in');
    });





    it('does pars a easymeter ESY5T3DC1024', () => {

        let reading = new Reading(
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

        expect(reading.manufacturerName).to.equal('easy_meter');
        expect(reading.productName).to.equal('5t3');
        expect(reading.meterSerialnumber).to.equal('60300856');
        expect(reading.energyAMilliwattHour).to.equal(1100000);
        expect(reading.energyBMilliwattHour).to.equal(1000000);
        expect(reading.powerAMilliwatt).to.equal(3830);
        expect(reading.powerBMilliwatt).to.equal(0);
        expect(reading.direction).to.equal('in_out');
    });




    it('does pars a hager HAG5eHZ010C_EHZ1ZA22', () => {

        let reading = new Reading(
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
        expect(reading.manufacturerName).to.equal('hager');
        expect(reading.productName).to.equal('ehz');
        expect(reading.meterSerialnumber).to.equal('1095100000053019');
        expect(reading.energyAMilliwattHour).to.equal(16986200);
        expect(reading.energyBMilliwattHour).to.equal(1574000);
        expect(reading.powerAMilliwatt).to.equal(29000);
        expect(reading.powerBMilliwatt).to.equal(0);
        expect(reading.direction).to.equal('in_out');
    });

});
