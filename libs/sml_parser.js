function SmlParser(sml) {

  var regex = /([0-9-:.]+)\*(?:[0-9]+)\((.*)\)/g;
  var m;
  var obis = {};
  while ((m = regex.exec(sml))) {
   obis[m[1]] = m[2];
  }
  this.obis = obis;



  if (sml.indexOf("ESY5Q3") == 1) {

    if (this.obis['1-0:1.7.255'] == undefined) {
      var phaseOne   = parseFloat(this.obis['1-0:21.7.0'].slice(0,-2));
      var phaseTwo   = parseFloat(this.obis['1-0:41.7.0'].slice(0,-2));
      var phaseThree = parseFloat(this.obis['1-0:61.7.0'].slice(0,-2));
    } else {
      var phaseOne   = parseFloat(this.obis['1-0:21.7.255'].slice(0,-2));
      var phaseTwo   = parseFloat(this.obis['1-0:41.7.255'].slice(0,-2));
      var phaseThree = parseFloat(this.obis['1-0:61.7.255'].slice(0,-2));
    }

    this.milliwatt = 1000 * (phaseOne + phaseTwo + phaseThree);
    this.meterSerialnumber = this.obis['1-0:0.0.0']

    this.milliwattHourA = parseInt((this.obis['1-0:1.8.0']).slice(0,-4)*1000*1000);

    if (this.obis['1-0:2.8.0'] == undefined) {
      this.milliwattHourB = null;
    } else {
      this.milliwattHourB = parseInt((this.obis['1-0:2.8.0']).slice(0,-4)*1000*1000);
    }

  } else if (sml.indexOf("HAG5eHZ") == 1) {
    var phaseOne   = parseFloat(this.obis['1-0:21.7.0'].slice(0,-2));
    var phaseTwo   = parseFloat(this.obis['1-0:41.7.0'].slice(0,-2));
    var phaseThree = parseFloat(this.obis['1-0:61.7.0'].slice(0,-2));
    this.milliwatt = 1000 * (phaseOne + phaseTwo + phaseThree);
    this.meterSerialnumber = this.obis['0:0.0.0']
    this.milliwattHourA = parseInt(this.obis['1-0:1.8.1']*1000*1000);
    this.milliwattHourB = parseInt(this.obis['1-0:2.8.1']*1000*1000);
  } else {
    console.log("unknown SML Format")
  }
}


module.exports = SmlParser;
