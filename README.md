Washington Metropolitan Area Transit Authority API Node.JS Wrapper
============================================

[![Tests](https://travis-ci.org/anderMatt/wmata-api-node.svg?branch=master)](https://travis-ci.org/anderMatt/wmata-api-node)
[![Coverage Status](https://coveralls.io/repos/anderMatt/wmata-api-node/badge.svg)](https://coveralls.io/r/anderMatt/wmata-api-node)

This is a wrapper for the [WMATA Web API](https://developer.wmata.com) that
runs on Node.JS.

It includes helper functions to do the following:

#### Bus Information
- Bus positions
- Bus arrival time predictions

#### Train Information
- Train positions
- Train arrival time predictions

##### Dependencies

This project deponds on [request](https://github.com/request/request) to make HTTP requests.

## Installation
    
    $ npm install wmata-api-node --save

## Usage

First, instantiate the wrapper.
```javascript
var WmataApi = require('wmata-api-node');

// Instantiate the api with your api key
var wmataApi = new WmataApi('mysupersecretkey123');
```

Use the wrapper's methods to make requests to WMATA's web API. Methods use promises, so be sure to provide success and error handlers.
```javascript
// Get bus positions for the D2 line 
wmataApi.getBusPositions('D2')
    .then(data => {
        console.log('Bus positions', data.BusPositions);
    })
    .catch(err => {
        console.error(err);
    });
```

### Authorization
You must provide an API key to the wrapper at instantiation. See [WMATA's API documentation](https://developer.wmata.com) for steps on obtaining your free API key.

## Development

Discover a bug, or have improvements? [Open an issue](https://github.com/anderMatt/wmata-api-node/issues/new) or clone the project and send a pull request with your changes!

### Running tests
You can run unit tests by executing `mocha`.
