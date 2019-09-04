const express = require("express");
const router = express.Router();
const CSVHandler = require("../classes/CSVHandler");
const DateHandler = require("../classes/DateHandler");
const Analyticals = require("../classes/Analyticals");
const GenerateDataPoints = require("../classes/GenerateDataPoints");


let clientsGainedFile = new CSVHandler(__dirname + '/dataStoreFiles/clientsGained.csv');
let clientsLostFile = new CSVHandler(__dirname + '/dataStoreFiles/clientsLost.csv');
let leadsLostFile = new CSVHandler(__dirname + '/dataStoreFiles/leadsLost.csv');

//
// let analytics = new Analyticals(clientsGainedFile, clientsLostFile, leadsLostFile);
//
//
// let datapoints = analytics.getDataPointsAndLabelsForThePast14Days();


// let dataPoints = new GenerateDataPoints('clientsGained', clientsGainedFile, clientsLostFile, leadsLostFile);
// let data = dataPoints.getPast14DaysOfDataPoints();


// uses the getCurrentDate() method instead of getCurrentDateTime() method,
// as the dates stored in the database wont contain time information. This will allow for an easy check on the dates
const DATE = DateHandler.getCurrentDate(); // date is a constant value as it will not get changed at all
let date = DATE; // date is used as a temp variable that will get manipulated in the loop
let noDays = 7;
let numberOfDateMatches = 0;
// variables below used to get the date into dd/mm/yyyy for the labels
let dateDDMMYY_to_standardDateTime;
let standardDateToDDMMYYY;

// console.log(`current date: ${DATE}`); // will output the current date for debugging

for (let i = noDays - 1; i >= 0; i-- ) {
    date = DateHandler.subtractFromDate(DATE, {days: i});
    console.log(date.split('T')[0]+'T00:00:00+00:00');
}

//              DATE HAS 1'S IN THE TIME PORTION AND IS BEING MATCHED TO DATES THAT ARE ALL 0'S IN THE TIME PORTION.
//                  2019-08-29T01:00:00+01:00   =/=   2019-08-29T00:00:00+00:00


console.log(data);