'use strict';

/**@module request endpoints */

const BASE_URL = "https://api.wmata.com";

module.exports = {
    bus: {
        positions: `${BASE_URL}/Bus.svc/json/jBusPositions`,  //+ query string.
        predictions: `${BASE_URL}/NextBusService.svc/json/jPredictions`,
        incidents: `${BASE_URL}/Incidents.svc/json/BusIncidents` //optional ?Route=
    },

    train: {
        positions: `${BASE_URL}/TrainPositions/TrainPositions?contentType=json`,  //only support JSON. API also offers XML option.
        predictions: `${BASE_URL}/StationPrediction.svc/json/GetPrediction`, //add station code or 'all' to url.
        incidents: `${BASE_URL}/Incidents.svc/json/Incidents`
    }
};
