var WmataApi = require('./wmata-api');
var busMethods = require('./bus-methods');
var trainMethods = require('./train-methods');

WmataApi._addMethods(busMethods);
WmataApi._addMethods(trainMethods);

module.exports = WmataApi;
