function SmlParser(sml) {

  var regex = /([0-9-:.]+)\*(?:[0-9]+)\((.*)\)/g;
  var m;
  var obis = {};
  while ((m = regex.exec(sml))) {
   obis[m[1]] = m[2];
  }
  this.obis = obis;
  this.header = sml.trim().split('\n')[0].slice(1);


  switch(this.header) {

    case "ESY5Q3DA1004 V3.02":
      var phaseOne   = parseFloat(this.obis['1-0:21.7.255'].slice(0,-2));
      var phaseTwo   = parseFloat(this.obis['1-0:41.7.255'].slice(0,-2));
      var phaseThree = parseFloat(this.obis['1-0:61.7.255'].slice(0,-2));
      this.power = phaseOne + phaseTwo + phaseThree;
      this.wattHour = parseInt((this.obis['1-0:1.8.0']).slice(0,-4)*1000);
      this.meterSerialnumber = this.obis['1-0:0.0.0']
      break;

    case "HAG5eHZ010C_EHZ1ZA22":
      var phaseOne   = parseFloat(this.obis['1-0:21.7.0'].slice(0,-2));
      var phaseTwo   = parseFloat(this.obis['1-0:41.7.0'].slice(0,-2));
      var phaseThree = parseFloat(this.obis['1-0:61.7.0'].slice(0,-2));
      this.power = phaseOne + phaseTwo + phaseThree
      this.wattHour = parseInt(this.obis['1-0:1.8.1']*1000);
      this.meterSerialnumber = this.obis['0:0.0.0']
      break;

  }
}


module.exports = SmlParser;
