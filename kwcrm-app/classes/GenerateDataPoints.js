const CSVHandler = require('./CSVHandler');
const DateHandler = require('./DateHandler');

const _getDataPointsFromLast7Days = Symbol("getDataPointsFromLast7Days");
const _fileToLookThrough = Symbol("fileToLookThrough");
const _clientsGainedCSVHandlerObject = Symbol("clientsGainedCSVHandlerObject");
const _clientsLostCSVHandlerObject = Symbol("clientsLostCSVHandlerObject");
const _leadsLostCSVHandlerObject = Symbol("leadsLostCSVHandlerObject");

class GenerateDataPoints{

    constructor (fileToLookThrough, clientsGainedCSVHandlerObject, clientsLostCSVHandlerObject, leadsLostCSVHandlerObject) {
        this[_fileToLookThrough] = fileToLookThrough;
        this[_clientsGainedCSVHandlerObject] = clientsGainedCSVHandlerObject;
        this[_clientsLostCSVHandlerObject] = clientsLostCSVHandlerObject;
        this[_leadsLostCSVHandlerObject] = leadsLostCSVHandlerObject;
    }

    // will get the data points and the labels for the past 7 days over however many weeks and return the labels as dd/mm/yyyy
    // and will also output the data points which will be the number of matches found on the date being checked
    [_getDataPointsFromLast7Days] (numOfWeeks) {

        let clientsGained = this[_clientsGainedCSVHandlerObject];
        let clientsLost = this[_clientsLostCSVHandlerObject];
        let leadsLost = this[_leadsLostCSVHandlerObject];

        let dataPointsArray = [];
        let datesArray = []; // will be used to store the dates so that they can be used as labels for the graph

        // uses the getCurrentDate() method instead of getCurrentDateTime() method,
        // as the dates stored in the database wont contain time information. This will allow for an easy check on the dates
        const DATE = DateHandler.getCurrentDate(); // date is a constant value as it will not get changed at all
        let date = DATE; // date is used as a temp variable that will get manipulated in the loop
        let noDays = numOfWeeks * 7;
        let numberOfDateMatches = 0;
        // variables below used to get the date into dd/mm/yyyy for the labels
        let dateDDMMYY_to_standardDateTime;
        let standardDateToDDMMYYY;

        // console.log(`current date: ${DATE}`); // will output the current date for debugging

        for (let i = noDays - 1; i >= 0; i-- ){
            date = DateHandler.subtractFromDate(DATE, {days: i});
            date = date.split('');
            date = date.splice(0, 11);
            date = date.join('') + "00:00:00+00:00";
            // console.log(`${i} days ago: ${date}`); // can be used to check the dates I am getting back


            switch (this[_fileToLookThrough]){
                case "clientsGained":
                    numberOfDateMatches = clientsGained.countMatches([1],date);
                    break;
                case "clientsLost":
                    numberOfDateMatches = clientsLost.countMatches([1],date);
                    break;
                case "leadsLost":
                    numberOfDateMatches = leadsLost.countMatches([1],date);
                    break;
                default:
                    console.error("ensure the fileToLook through constructor method argument is: 'clientsGained', 'clientsLost', or 'leadsLost' \n" +
                        "You entered: " + this[_fileToLookThrough]);
                    break;
            }


            // done to get the date into dd/mm/yyyy for the labels
            dateDDMMYY_to_standardDateTime = DateHandler.standardDateTo_Date_DDMMYYYY(date);
            standardDateToDDMMYYY = DateHandler.standardDateTo_Date_DDMMYYYY(DateHandler.createTimeStamp(dateDDMMYY_to_standardDateTime));

            datesArray.push(standardDateToDDMMYYY); // appends the dd/mm/yyyy labels to the datesArray

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            dataPointsArray.push(numberOfDateMatches); // puts the number of matches per date into an array
        }
        // method returns an object containing the labels and the corresponding dataPoints
        return {labels: datesArray, dataPoints: dataPointsArray};
    }




    // returns the last 14 days of data points for the files: clientsGained, clientsLost leadsLost
    // them above strings are the accepted parameter values in the string type
     getPast14DaysOfDataPoints() {

        return this[_getDataPointsFromLast7Days] (2, this[_fileToLookThrough]);
    }




    // returns data points for 12 weeks of matches from the files: clientsGained, clientsLost leadsLost
    // them above strings are the accepted parameter values in the string type
     getDataPointsForLast12Weeks () {
        // get the past 12 weeks of data as individual days and then go through the array
        // add 7 of the match numbers at a time append that value to a new array for data points
        // and the first date of the 7 dates to a different array for labels

        let allLabels = this[_getDataPointsFromLast7Days](12).labels;
        let allDataPoints = this[_getDataPointsFromLast7Days](12).dataPoints;
        let usedLabels = [];
        let usedDataPoints = [];
        let totalMatchesInTheWeek;

        // goes through all 12 weeks
        for (let i = 0; i < 12; i++){

            totalMatchesInTheWeek = 0; // initializes the variable / resets the variable back to 0

            usedLabels.push(allLabels[i*7]); // appends the 1st date of each week into an array for the labels

            // goes through all 7 days in the week
            for (let j = 0; j < 7; j++) {
                totalMatchesInTheWeek += allDataPoints[j]; // gets total matches for the week
            }

            usedDataPoints.push(totalMatchesInTheWeek); // appends the average number of matches within the week to an array
            allDataPoints.splice(0,7); // deletes the first week (7 days)/ 7 elements of the array as they are no longer needed

        }
        return {labels: usedLabels, dataPoints: usedDataPoints}
    }



     getDataPointsForLast12Months () {

        // get the dates of the past 12 months
         // turn them dates into yyyy-mm and store in an array
        // count matches in the 2nd index of the files for each of the 12 dates

         let clientsGained = this[_clientsGainedCSVHandlerObject];
         let clientsLost = this[_clientsLostCSVHandlerObject];
         let leadsLost = this[_leadsLostCSVHandlerObject];

         const CURRENT_DATE = DateHandler.getCurrentDateTime(); // gets the current time
         let date = CURRENT_DATE; // will be the variable getting changed
         let numberOfDateMatches;
         let dataPointsArray = [];
         let labelsArray = [];


         for (let i = 11; i >= 0; i--) {

             date = DateHandler.subtractFromDate(date, {month: i}); // subtracts i months from the current date

             labelsArray.push(DateHandler.dateToWordedMonth(date)); // appends the month as it's name to the csv file

             date = date.split(""); // puts the date into an array of characters
             date.splice(7,18); // gets rid of the last 18 characters
             date = date.join("");


             switch (this[_fileToLookThrough]){
                 case "clientsGained":
                     numberOfDateMatches = clientsGained.countMatches([2],date);
                     break;
                 case "clientsLost":
                     numberOfDateMatches = clientsLost.countMatches([2],date);
                     break;
                 case "leadsLost":
                     numberOfDateMatches = leadsLost.countMatches([2],date);
                     break;
                 default:
                     console.error("ensure the fileToLook through constructor method argument is: 'clientsGained', 'clientsLost', or 'leadsLost' \n" +
                         "You entered: " + this[_fileToLookThrough]); // outputs an error message of what is most likely the cause of any problems in this case
                     break;
             }

             dataPointsArray.push(numberOfDateMatches); // appends the number of matches found for that month to the data points array


             date = CURRENT_DATE; // sets the date back to the current date so that it can be
         }

         return {labels: labelsArray, dataPoints: dataPointsArray}

    }

}

module.exports = GenerateDataPoints;

