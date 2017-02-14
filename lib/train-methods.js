'use strict';

const endpoints = require('./endpoints');
var WmataApiError = require('./wmata-api-error');

module.exports = {
    
    getTrainPositions: function(callback){
        var url = endpoints.train.positions;
        var promise = this._makeApiRequest(url);

        if(callback){
            promise.then(function(data){
                callback(null ,data);
            }, function(err){
                callback(err);
            });
        }

        else{
            return promise;
        }
    },

    getTrainPredictions: function(stationCode, callback){
        if(!stationCode){
            return Promise.reject(new TypeError('You must specify a station code, or the string "all".'));
        }

        if(stationCode.toLowerCase() !== 'all' && 
            !(/[a-zA-Z]\d{2}/.test(stationCode))){
            return Promise.reject(new TypeError('Station code must match the format "<letter><num><num>", or the string "all".'));
        }

        var url = `${endpoints.train.predictions}/${stationCode}`;
        var promise = this._makeApiRequest(url);

        if(callback){
            promise.then(function(data){
                callback(null, data);
            }, function(err){
                callback(err);
            });
        }
        else{
            return promise;
        }
    }
}
