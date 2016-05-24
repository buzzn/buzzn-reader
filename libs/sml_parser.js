function SmlParser(sml) {

  var regex = /([0-9-:.]+)\*(?:[0-9]+)\((.*)\)/g;
  var m;
  var obis = {};
  while ((m = regex.exec(sml))) {
   obis[m[1]] = m[2];
  }
  this.obis = obis;


  function appendValue(array,value) {
    var items = []
    for(var i=0; i<array.length; i++){
      items.push(array[i]+value)
    }
    return items
  }

  function existInSML(element, index, array) {
    return sml.indexOf(element) > 0
  }

  function parsePhase(phase) {
    return parseFloat(this.obis['1-0:21.7.0'].slice(0,-2));
  }

  this.getPowerMilliwatt = function (obisIds) {
    if (obisIds.every(existInSML)) {
      var phases0   = appendValue(obisIds, '0');
      var phases255 = appendValue(obisIds, '255');
      if (phases0.every(existInSML)) {
        var phaseOne   = parseFloat(this.obis['1-0:21.7.0'].slice(0,-2));
        var phaseTwo   = parseFloat(this.obis['1-0:41.7.0'].slice(0,-2));
        var phaseThree = parseFloat(this.obis['1-0:61.7.0'].slice(0,-2));
        return 1000 * (phaseOne + phaseTwo + phaseThree);
      }else if (phases255.every(existInSML)) {
        var phaseOne   = parseFloat(this.obis['1-0:21.7.255'].slice(0,-2));
        var phaseTwo   = parseFloat(this.obis['1-0:41.7.255'].slice(0,-2));
        var phaseThree = parseFloat(this.obis['1-0:61.7.255'].slice(0,-2));
        return 1000 * (phaseOne + phaseTwo + phaseThree);
      }else {
        return null
      }
    }else {
      return null;
    }
  };

  this.getEasymeterEnergyMilliwattHour = function (obisId) {
    if (Object.keys(this.obis).indexOf(obisId) >= 0) {
      return parseInt((this.obis[obisId]).slice(0,-4)*1000*1000);
    }else {
      return null
    }
  };

  this.getHagerEnergyMilliwattHour = function (obisId) {
    if (Object.keys(this.obis).indexOf(obisId) >= 0) {
      return parseInt((this.obis[obisId])*1000*1000);
    }else {
      return null
    }
  };

  this.getObisRaw = function (obisId) {
    if (Object.keys(this.obis).indexOf(obisId) >= 0) {
      return this.obis[obisId];
    }else {
      return null
    }
  };


  if (sml.indexOf("ESY5Q3") >= 0) {
    this.manufacturerName     = 'easy_meter';
    this.productName          = '5q3';
    this.meterSerialnumber    = this.getObisRaw('1-0:0.0.0');
    this.powerMilliwatt       = this.getPowerMilliwatt(['1-0:21.7.', '1-0:41.7.', '1-0:61.7.'])
    this.energyAMilliwattHour = this.getEasymeterEnergyMilliwattHour('1-0:1.8.0')
    this.energyBMilliwattHour = this.getEasymeterEnergyMilliwattHour('1-0:2.8.0')

  } else if (sml.indexOf("ESY5T3") >= 0) {
    this.manufacturerName     = 'easy_meter';
    this.productName          = '5t3';
    this.meterSerialnumber    = this.getObisRaw('1-0:0.0.0');
    this.powerMilliwatt       = this.getPowerMilliwatt(['1-0:21.7.', '1-0:41.7.', '1-0:61.7.'])
    this.energyAMilliwattHour = this.getEasymeterEnergyMilliwattHour('1-0:1.8.0')
    this.energyBMilliwattHour = this.getEasymeterEnergyMilliwattHour('1-0:2.8.0')

  } else if (sml.indexOf("HAG5eHZ") >= 0) {
    this.manufacturerName     = 'hager';
    this.productName          = 'ehz';
    this.meterSerialnumber    = this.getObisRaw('0:0.0.0');
    this.powerMilliwatt       = this.getPowerMilliwatt(['1-0:21.7.', '1-0:41.7.', '1-0:61.7.'])
    this.energyAMilliwattHour = this.getHagerEnergyMilliwattHour('1-0:1.8.1')
    this.energyBMilliwattHour = this.getHagerEnergyMilliwattHour('1-0:2.8.1')

  } else {
    this.manufacturerName     = null;
    this.productName          = null;
    this.meterSerialnumber    = null;
    this.powerMilliwatt       = null;
    this.energyAMilliwattHour = null;
    this.energyBMilliwattHour = null;
  }
}


module.exports = SmlParser;
