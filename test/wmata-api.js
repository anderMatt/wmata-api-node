const chai = require('chai'); 
const sinon = require('sinon');
var should = chai.should();
var WmataApi = require('../lib/server');
var endpoints = require('../lib/endpoints');

var assert = require('assert');

describe('Wmata API', function(){
    it('should set API key', function(){
        var key = "mySecretKey12345";
        var api = new WmataApi(key);

        api.getApiKey().should.equal(key);
    });

    describe('#getBusPositions', function(){
        it('should retrieve bus positions', function(){
           var api = new WmataApi(); 
           var opts = {
               routeId: 'D2',
               radius: 5,
               lat: 38.918308,
               lon: -77.096014
            };

            sinon.stub(api, '_makeApiRequest', function(url){
                var expected = `${endpoints.bus.positions}?routeId=D2&radius=5&lat=38.918308&lon=-77.096014`;
                url.should.equal(expected);
                return Promise.resolve({BusPositions: []});
            });

            return api.getBusPositions(opts)
                .then(function(data){
                    data.should.contain.keys('BusPositions');
            });
        });

        it('should retrieve error with invalid options', function(){

            var api = new WmataApi();

            sinon.stub(api, '_validateBusPositionOptions', function(){ 
                return {'radius': 'Must be greater than zero'}; //a validation error.
            });

            return api.getBusPositions()
                .then(function(){
                    //
                }, function(err){
                    err.radius.should.equal('Must be greater than zero');
                });
        });
    });
});
