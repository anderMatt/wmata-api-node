var WmataApi = require('./wmata-api');
var busMethods = require('./bus-methods');
//train methods.
WmataApi._addMethods(busMethods);

module.exports = WmataApi;
