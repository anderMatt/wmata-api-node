'use strict';

/** @module bus-methods */

var endpoints = require("./endpoints");
const queryString = require('querystring');
var WmataApiError = require('./wmata-api-error');

module.exports = {

    /**
     * Get real-time bus positions.
     * @param {Object} [opts] The possible options. If not supplied, returns data for all activate buses.
     * @param {string} opts.routeId Get bus positions for specific route.
     * @param {number} opts.lat Search latitude. Longitude and radius must  be provided.
     * @param {number} opts.lon Search longitude. Latitude and radius must be provided.
     * @param {number} opts.radius Search radius, in miles. Longitude and latitude must be provided.
     * @param {requestCallback} [callback] Optional callback method to be called instead of a promise.
     * @example getBusPositions({routeId: 'D2', lat: 38.896584, lon: -76.958446, radius: 5}).then(data => positions=data.BusPositions)
     * @returns {Promise|undefined} A promise that if successful, returns an object containing a 'Bus Positions'
     *      property. If rejected, contains as error object. Not returned if a callback is given.
    */
    
    getBusPositions: function(opts, callback){   

        var opts = opts || {};
        var errs = this._validateBusPositionOptions(opts);

        if(errs){ //TODO: callback with errs.
            return Promise.reject(errs);
        }

        //construct the request url.
        var queryParams = queryString.stringify(opts);
        var url = `${endpoints.bus.positions}?${queryParams}`;
        
        var promise = this._makeApiRequest(url);

        if(callback){
            promise.then(function(data){
                callback(null, data);
            }, function(err){
                callback(err);
            });
        }

        else {
            return promise;
        }
    },

    _validateBusPositionOptions: function(opts){
        var errors = {};

        if(opts.routeId && !(typeof opts.routeId === 'string')){
            errors["routeId"] = '"RouteID" must be of type string.'
        }

        if(opts.lat && isNaN(opts.lat)){
            errors["lat"] = '"Lat" must be a number.'
        }

        if(opts.lon && isNaN(opts.lon)){
            errors["lon"] = '"Lon" must be a number.'
        }

        if(opts.radius && (isNaN(opts.radius) || opts.radius<1)){
            errors["radius"] = '"Radius" must be a number greater than zero.'
        }

        //Make sure lat, lon, and radius options are all specified, if any of them are passed.
        if((opts.lat || opts.lon || opts.radius) &&
            !(opts.lat && opts.lon && opts.radius)){ 

            var missing = this._getMissingLatLonRadiusArgs(opts);
            var msg = (missing.length > 1 ?
                `${missing.join(' and ')} arguments are missing.` :
                `${missing[0]} argument is missing.`
            );

            errors["Search Area"] = `Latitude, longitude, and radius options must all be supplied, or not at all. ${msg}`;
        }

        return (Object.keys(errors).length === 0 ? //check if there are any errors.
            null:
            errors
        );
    }, //Returns object with error messages, [optionWithError]: "errorMsg".

    _getMissingLatLonRadiusArgs: function(opts){ //Check which options are missing for the error message.
        var keywords = ['lon', 'lat', 'radius'];
        var missing = keywords.filter(option => {
            return !(opts.hasOwnProperty(option));
        });

        return missing;
    },

    /**
     * Get bus arrival time predictions for a bus stop.
     * @param {number|string} stopId: Bus stop ID.
     * @param {requestCallback} [callback] Optional callback method to be called instead of a promise.
     * @example getBusPredictions(1001195).then(...)
     * @returns {Promise|undefined} A promise that if successful, returns an object containing
     *  bus arrival time prediction information. If rejected, contains as error object. Not returned if 
     *  a callback is given.
    */

    getBusPredictions: function(stopId, callback){
        if(typeof stopId === 'undefined'){
            return Promise.reject(new TypeError('You must specify a bus stop ID.'));
        }

        //construct the request url.
        var url = `${endpoints.bus.predictions}?StopId=${stopId}`;
        var promise = this._makeApiRequest(url);

        if(callback){
            promise.then(function(data){
                callback(null, data);
            }, function(err){
                callback(err);
            });
        }

        else {
            return promise
                .catch(err => {
                    if (err.statusCode == "400"){ //bus stop does not exist.
                        err.setMessage(`Bus stop "${stopId}" does not exist!`);
                    }
                    throw err;
                });
            }
            
        }

    }
