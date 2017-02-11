'use strict';

var endpoints = require("./endpoints");
const queryString = require('querystring');

module.exports = {
    
    getBusPositions: function(opts, callback){   //not implementing CB for now. Just promises to start.

        var opts = opts || {};

        var errs = this._validateBusPositionOptions(opts);

        if(errs){ //TODO: callback with errs.
            return Promise.reject(errs);
        }

        //construct the request url.
        var queryParams = queryString.stringify(opts);
        var url = `${endpoints.bus.positions}?${queryParams}`;
        
        console.log('Passing this url to _makeApiRequest: ' + url);

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

        if((opts.lat || opts.lon || opts.radius) &&
            !(opts.lat && opts.lon && opts.radius)){ //All three options must be supplied, or not at all.

            var missing = this._getMissingLatLonRadiusArgs(opts);
            var msg = (missing.length > 1 ?
                `${missing.join(' and ')} arguments are missing` :
                `${missing[0]} argument is missing`
            );

            errors["Arguments"] = `Latitude, longitude, and radius options must all be supplied, or not at all. ${msg}`;
        }

        return (Object.keys(errors).length === 0 ? //check if there are any errors.
            null:
            errors
        );
    }, //Returns Err obj, [option]:"msg"

    _getMissingLatLonRadiusArgs(opts){ //Check which options are missing for the error message.
        var keywords = ['lon', 'lat', 'radius'];
        var missing = keywords.filter(option => {
            return !(opts.hasOwnProperty(option));
        });

        return missing;
    }

}
