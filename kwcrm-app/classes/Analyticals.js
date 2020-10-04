const DateHandler = require('./DateHandler');
const ConversionRate = require('./ConversionRate');
const GenerateDataPoints = require('./GenerateDataPoints');


const _clientsGainedFilePath = Symbol("clientsGainedFilePath");
const _clientsLostFilePath = Symbol("clientsLostFilePath");
const _leadsLostFilePath = Symbol("leadsLostFilePath");

// The class that will be used to handle all back-end tasks of the Analyticals page.
class Analyticals {

    constructor(clientsGainedCSVHandlerObject, clientsLostCSVHandlerObject, leadsLostCSVHandlerObject) {

        this[_clientsGainedFilePath] = clientsGainedCSVHandlerObject;
        this[_clientsLostFilePath] = clientsLostCSVHandlerObject;
        this[_leadsLostFilePath] = leadsLostCSVHandlerObject;
    }

    // this static method will return an object for the conversion rate of
    // the month as both a percentage and as a ratio in it's lowest form
     GetConversionRateForTheMonth () {

        let clientsGainedFile = this[_clientsGainedFilePath];
        let leadsLostFile = this[_leadsLostFilePath];

        let currentDate = DateHandler.getCurrentDate();
        let numberOfClientsGainedThisMonth;
        let numberOfLeadsLostThisMonth;


        // to find data for clients gained and leads lost this month I will have to find all the matches
        // in the second index against the current date in standard time with the last 18 characters truncated
        // as in the 2nd index of all the analytics files there is the month and year stored as yyyy-mm

        currentDate = currentDate.split(""); // turns the date into an array of characters
        currentDate.splice(7,18); // truncates the last 18 characters from the array
        currentDate = currentDate.join(""); // joins the array together into a string and stores the value into the variable

        numberOfClientsGainedThisMonth = clientsGainedFile.countMatches([2], currentDate);
        numberOfLeadsLostThisMonth = leadsLostFile.countMatches([2], currentDate);

        return ConversionRate.conversionRate(numberOfClientsGainedThisMonth, numberOfLeadsLostThisMonth);
    }


    // will return the data points and labels for both clients gained and lost
    // done for the past 14 days

     getDataPointsAndLabelsForThePast14Days () {

        let clientsLost = new GenerateDataPoints("clientsLost",
            this[_clientsGainedFilePath],
            this[_clientsLostFilePath],
            this[_leadsLostFilePath]);

        let clientsGained = new GenerateDataPoints("clientsGained",
            this[_clientsGainedFilePath],
            this[_clientsLostFilePath],
            this[_leadsLostFilePath]);

        // returns an object containing data for the clients gained and lost with their relative
        // data points and labels to go along with both

        return {

            clientsGained: {
                dataPoints: clientsGained.getPast14DaysOfDataPoints().dataPoints,
                labels: clientsGained.getPast14DaysOfDataPoints().labels
            },

            clientsLost: {
                dataPoints: clientsLost.getPast14DaysOfDataPoints().dataPoints,
                labels: clientsLost.getPast14DaysOfDataPoints().labels
            }
        }

    }


    // will return the data points and labels for both clients gained and lost
    // done for the past 12 weeks

     getDataPointsAndLabelsForThePast12Weeks () {

        let clientsLost = new GenerateDataPoints("clientsLost",
            this[_clientsGainedFilePath],
            this[_clientsLostFilePath],
            this[_leadsLostFilePath]);

        let clientsGained = new GenerateDataPoints("clientsGained",
            this[_clientsGainedFilePath],
            this[_clientsLostFilePath],
            this[_leadsLostFilePath]);

        // returns an object containing data for the clients gained and lost with their relative
        // data points and labels to go along with both

        return {

            clientsGained: {
                dataPoints: clientsGained.getDataPointsForLast12Weeks().dataPoints,
                labels: clientsGained.getDataPointsForLast12Weeks().labels
            },

            clientsLost: {
                dataPoints: clientsLost.getDataPointsForLast12Weeks().dataPoints,
                labels: clientsLost.getDataPointsForLast12Weeks().labels
            }
        }

    }

    // will return the data points and labels for both clients gained and lost
    // done for the past 12 months

     getDataPointsAndLabelsForThePast12Months () {

        let clientsLost = new GenerateDataPoints("clientsLost",
            this[_clientsGainedFilePath],
            this[_clientsLostFilePath],
            this[_leadsLostFilePath]);

        let clientsGained = new GenerateDataPoints("clientsGained",
            this[_clientsGainedFilePath],
            this[_clientsLostFilePath],
            this[_leadsLostFilePath]);

        // returns an object containing data for the clients gained and lost with their relative
        // data points and labels to go along with both

        return {

            clientsGained: {
                dataPoints: clientsGained.getDataPointsForLast12Months().dataPoints,
                labels: clientsGained.getDataPointsForLast12Months().labels
            },

            clientsLost: {
                dataPoints: clientsLost.getDataPointsForLast12Months().dataPoints,
                labels: clientsLost.getDataPointsForLast12Months().labels
            }
        }

    }

}


module.exports = Analyticals;
