'use strict';

/**@module request endpoints */

const BASE_URL = "https://api.wmata.com";

module.exports = {
    bus: {
        positions: `${BASE_URL}/Bus.svc/json/jBusPositions`,  //+ query string.
        predictions: `${BASE_URL}/NextBusService.svc/json/jPredictions`
    }

    //train{}
};
