'use strict';

/** @module train-methods */

const endpoints = require('./endpoints');
var WmataApiError = require('./wmata-api-error');

module.exports = {
    
    /**
     * Get real-time train positions.
     * @param {requestCallback} [callback] Optional callback method to be called instead of a promise.
     * @example getTrainPositions().then(data=> positions=data.TrainPositions)
     * @returns {Promise|undefined} A promise that if successful, returns an object with a 'TrainPositions' property mapping
     *      to an array of train position information objects. If rejected, contains an error object. 
     *      Not returned if a callback is given.
     */
    
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

    /**
     * Get train arrival time predictions for one or more stations.
     * @param {string} stationCode: A station ID code. Each station has a code of the format <letter><number><number>. Pass the
     *      string 'all' as the stationCode to recieve arrival time predictions for all active trains.
     * @example getTrainPredictions('B10').then(data => predictions = data.Trains)
     * @returns {Promise|undefined} A promise that if successful, returns an object with a 'Trains' property mapping to an array
     *      of train prediction information objects. If rejected, contains an error object. Not returned if callback if given.
     */

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
