function Sml(sml) {
  this.sml = sml;
}
// class methods
Sml.prototype.meter = function() {
  return this.sml;
};

Sml.prototype.obis = function() {
  var regex = /([0-9-:.]+)[^(]*\(([^)]+)\)/g;
  var m;
  var obis = {};
  while ((m = regex.exec(this.sml))) {
   obis[m[1]] = m[2];
  }
  return obis;
};



module.exports = Sml;
