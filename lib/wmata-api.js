'use strict';

const request = require('request')
const endpoints = require('./endpoints');

//Exceptions

var InvalidApiKeyError = new TypeError("WMATA API access denied. Make sure your API key is valid.");


function WmataApi(apiKey){
    console.log("API instantiated with key: " + apiKey);
    this._apiKey = apiKey;
}

WmataApi.prototype = {

    getApiKey: function(){
        return this._apiKey;
    },
    
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
                        console.log('invalid api key was used in request.');
                        throw new InvalidApiKeyError;
                    }
                    
                    else{
                        reject(`Unexpected status code: ${resp.statusCode}`);
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
