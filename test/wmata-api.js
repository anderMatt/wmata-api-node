const chai = require('chai'); 
const sinon = require('sinon');
var should = chai.should();
var WmataApi = require('../lib/server');
var endpoints = require('../lib/endpoints');
var WmataApiError = require('../lib/wmata-api-error');

describe('Wmata API', function(){
    it('should set API key', function(){
        var key = "mySecretKey12345";
        var api = new WmataApi(key);

        api.getApiKey().should.equal(key);
    });

    describe('#_validateBusPositionOptions', function(){
        var api;

        beforeEach(function(){
            api = new WmataApi();
        });

        it('should receive no error when no options', function(){
            var opts = {};
            var errs = api._validateBusPositionOptions(opts);
            should.not.exist(errs);
        });

        it('should receive no error when valid options', function(){
            var opts = {
                routeId: 'D2',
                lat: '38.918308',
                lon: '-77.096014',
                radius: 5
            };

            var errs = api._validateBusPositionOptions(opts);
            should.not.exist(errs);
        });

        it('should receive error when invalid options', function(){
            var opts = {
                routeId: 'D2',
                lat: '38.918308',
                lon: '-77.096014'
                //radius is missing
            };

            var errs = api._validateBusPositionOptions(opts);
            errs.should.have.keys('Search Area');
        });
    });
    
    describe('#getBusPositions', function(){
        var api;

        beforeEach(function(){
            api = new WmataApi;
        });

        it('should retrieve bus positions', function(){
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

        it('should not retrieve bus positions when validation fails', function(){
            sinon.stub(api, '_validateBusPositionOptions', function(){
                return {errors: 'there are errors'};
            });

           var apiCall = sinon.stub(api, '_makeApiRequest', function(){ //stub to prevent accidental XHR.
                return;
            });

            return api.getBusPositions()
                .then(function(){
                    //
                }, function(){
                    apiCall.callCount.should.equal(0);
                });
        });
    });

    describe('#getBusPredictions', function(){
        var api;

        beforeEach(function(){
            api = new WmataApi();
        });

        it('should receive error when bus stop does not exist', function(){
            var fakeBusStop = 0;
            sinon.stub(api, '_makeApiRequest', function(url){
                url.should.equal(`${endpoints.bus.predictions}?StopId=0`);
                return Promise.reject(new WmataApiError(`Bus stop "${fakeBusStop}" does not exist!`, 400));
            });

            return api.getBusPredictions(fakeBusStop)
                .then(function(){
                    //
                }, function(err){
                    err.statusCode.should.equal(400);
                    err.msg.should.equal(`Bus stop "${fakeBusStop}" does not exist!`)
                });
        });
    });

    describe('#getTrainPositions', function(){
        it('should retrieve train positions', function(){
            var api = new WmataApi();
            sinon.stub(api, '_makeApiRequest', function(url){
                url.should.equal(`${endpoints.train.positions}`);
                return Promise.resolve({TrainPositions: []});
            });

            return api.getTrainPositions()
                .then(function(data){
                    data.should.contain.keys('TrainPositions');
                });
        });
    });

    describe('#getTrainPredictions', function(){
        it('should retrieve train predictions', function(){
            var api = new WmataApi();
            var stationCode = 'B10';

            sinon.stub(api, '_makeApiRequest', function(url){
                url.should.equal(`${endpoints.train.predictions}/${stationCode}`);
                return Promise.resolve({Trains: []});
            });

            return api.getTrainPredictions(stationCode)
                .then(function(data){
                    data.should.have.keys('Trains');
                });
        });

        it('should retrieve error when no station code passed', function(){
            var api = new WmataApi();
            var stationCode = undefined;

            var apiCall = sinon.stub(api, '_makeApiRequest', function(){
                //
            });

            api.getTrainPredictions(stationCode)
                .then(function(data){
                    //
                }, function(err){
                    apiCall.callCount.should.equal(0);
                });
        });
    });
});
