'use strict';

const request = require('request')
const endpoints = require('./endpoints');
var WmataApiError = require('./wmata-api-error');

/** WMATA API Wrapper
 * @class
 * @param {string} apiKey - API access authorization key.
 * @see {@link https://developer.wmata.com} for information on obtaining a key.
 */

function WmataApi(apiKey){
    console.log("API instantiated with key: " + apiKey);
    this._apiKey = apiKey;
}

WmataApi.prototype = {

    getApiKey: function(){
        return this._apiKey;
    },
    
    /* Makes API request and returns a promise.
     * If request is successful, resolves the response body.
     * If unsuccessful (error or status code other than 200),
     * rejects an object containing the returned status code,
     * and an error message.
     *
     * Calling methods can use this status code to construct a more
     * specific error for the user.
     */

    _makeApiRequest: function(url){         
        console.log('Inside _makeApiRequest with this url: ' + url);
        var self = this;

        var reqPromise = function(resolve, reject){
            request
            .get({
                    url: url,
                    headers: {
                        'api_key': self.getApiKey()
                    }
                }, function(err, resp, body){
                    if(err) reject(err);

                    else if(!err && resp.statusCode == 200){
                        var data = JSON.parse(body);
                        resolve(data);
                    }

                    else if(resp.statusCode == 401){
                        reject(new WmataApiError('WMATA Api access denied. Make sure your API key is valid.', resp.statusCode, url));
                    }
                    
                    else{
                        reject(new WmataApiError('Unexpected status code.', resp.statusCode, url));
                    }
                });
        }

        return new Promise(reqPromise);
    }

};

WmataApi._addMethods = function(methods){
        for(var m in methods){
            if(methods.hasOwnProperty(m)){
                this.prototype[m] = methods[m];
            }
        }
    }

module.exports = WmataApi;
