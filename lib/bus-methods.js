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
        console.log('Validating thes opts: ' + JSON.stringify(opts));
        var errors = {};

        if(opts.routeId && !(typeof opts.routeId === 'string')){
            errors["routeId"] = '"RouteID" must be of type string.'
        }

        console.log('Bus position param validation errs: ' + JSON.stringify(errors));

        return (Object.keys(errors).length === 0 ? //check if there are any errors.
            null:
            errors
        );
    } //Returns Err obj, [key]:"msg"
}
