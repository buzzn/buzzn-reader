function SmlParser(sml) {
  this.sml = sml;

  this.smlHeader = sml.trim().split('\n')[0].slice(1)

  var regex = /([0-9-:.]+)\*(?:[0-9]+)\((.*)\)/g;
  var m;
  var obis = {};
  while ((m = regex.exec(this.sml))) {
   obis[m[1]] = m[2];
  }
  this.obis = obis;
}


SmlParser.prototype.phaseOne = function() {
  parseFloat(obis['1-0:21.7.255'].slice(0,-2))
};



module.exports = SmlParser;
