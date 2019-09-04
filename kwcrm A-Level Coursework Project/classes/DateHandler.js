const moment = require('moment');

const _ddmmyyyyToStandardDateTimeCheck = Symbol('ddmmyyyyToStandardDateTimeCheck');

class DateHandler {

    // creates a time stamp from a date and a time
    // returns a time stamp that moment.js or the
    // Date class js has can work with. arguments to be type string
    // date => dd/mm/yyyy
    // time is optional, and the seconds value is also optional
    // time => hh:mm:ss || hh:mm
    static createTimeStamp (date, time) {
        let day, month, year, hour, minute, second; // declares variables
        if (time === undefined) {time = "00:00:00"} // if time is passed as an argument, time is set to "00:00:00"
        if (time.length === 5) {time = `${time}:00`} // if time is only hh:mm => the ss is set to 00
        date = date.split("/"); // splits the date string up into a string array ["dd","mm","yyyy"]
        time = time.split(":"); // splits the time string up into a string array ["hh","mm","ss"]
        day = date[0];
        month = date[1];
        year = date[2];
        hour = time[0];
        minute = time[1];
        second = time[2];
        return `${year}-${month}-${day}T${hour}:${minute}:${second}+00:00`;
    }

    // uses the moment library to get the current date and time
    // outputs a string in the standard date time stamp
    static getCurrentDateTime () {
        return moment().format();
    }

    // uses the moment library to get the current date and time
    // outputs a string in the standard date time stamp and then
    // turns the dateTimeStamp into the standard date time stamp but with
    // only the date information and the time data will all be set to 0
    static getCurrentDate() {
        // returns the result of the current time stamp turned into dd/mm/yyyy, turned into
        // the standard date time stamp but with not time information
        return this.createTimeStamp(this.standardDateTo_Date_DDMMYYYY(this.getCurrentDateTime()));
    }

    // pass a date time stamp as argument format: YYYY-MM-DD'T'HH:MM:SS+MS:mS
    // eg: '2019-02-02T22:52:49+00:00'
    // will output the date as dd/mm/yyyy
    static standardDateTo_Date_DDMMYYYY(dateTimeStamp){
        // could use moment(dateTimeStamp).format("DD/MM/YYYY");
        // but will use my own algorithm to extract the date instead

        // splits argument into an array containing the date at index 0 &  the time at index 1
        // [0] at the end gets us just the date element, split the date up into an array ["yyyy","mm","dd"]
        // could use .reverse and then .join("/") which would give me "dd/mm/yyyy"
        // but am writing them process myself for algorithm marks
        let date = dateTimeStamp.split("T")[0].split("-");

        // self invoking function that reverses the date and then stores the result in
        // the dateReversed variable
        let dateReversed = (() => {
            let temp = "";
            let j = date.length -1;
            for (let i = 0; i < date.length / 2; i++, j--) {
                temp = date[i];
                date[i] = date[j];
                date[j] = temp;
            }
            return date;
        })();

        return dateReversed.join("/");
    }

    // pass a date time stamp as argument format: YYYY-MM-DD'T'HH:MM:SS+MS:mS
    // eg: '2019-02-02T22:52:49+00:00'
    // will output the time as hh:mm:ss if the withSeconds argument is == true
    // if it is not then the time will be outputted as hh:mm
    static standardDateTo_Time_HHMMSS(dateTimeStamp, withSeconds){

        // splits argument into an array containing the date at index 0 &  the time at index 1
        // [1] at the end gets us just the time element. split the time element up into an array of characters,
        // the array of characters will be: ["h","h",":","m","m",":","s","s","+","m","s",":","m","s"]
        // in terms of format and length. if withSeconds option parameter is set to true, then all the characters
        // in the array after the 7th index will get removed. if withSeconds is not true, elements after 4th index will get removed
        let time = dateTimeStamp.split("T")[1].split("");
        let indexToRemoveFrom;
        if (withSeconds !== true) {indexToRemoveFrom = 5 }
        else { indexToRemoveFrom = 8 }
        //self invoking function that truncates the array of unwanted data will be returned
        return (() => {
            let outputArr = []; // declare output array
            // append elements from time to outputArray up to the indexToRemoveFrom
            for (let i = 0; i < indexToRemoveFrom; i++){ outputArr.push(time[i]) }
            return outputArr.join(""); //joins the array of characters together into a string
        })();
    }

    // checks if the dateToCheck is equal to the current date
    // dateToCheck should be type string in either dd/mm/yyyy format or standard date time format
    static isToday (dateToCheck) {
        // gets the users current date in a time stamp. Then, that time stamp
        // gets turned into a dd/mm/yyyy format
        let currentDate = this.standardDateTo_Date_DDMMYYYY(this.getCurrentDateTime());
        // checks to see if the date is in standard time or dd/mm/yyyy format
        // if it is in standard time format then the length of the string will not be = to 10
        // in that case the dateToCheck is converted into dd/mm/yyyy format
        if (dateToCheck.length !== 10) { dateToCheck = this.standardDateTo_Date_DDMMYYYY(dateToCheck) }
        // compares the 2 strings, if the dates are equal true is returned. Otherwise, false is returned
        return (dateToCheck === currentDate);
    }




    // checks if the dateToCheck's month or year is equal to the current month or year
    // dateToCheck should be type string in either dd/mm/yyyy format or standard date time format
    // monthOrYear option should be set to 'month' or 'year'
    static isThisMonthOrYear (dateToCheck, monthOrYearOption) {
        // gets the users current date in a time stamp. Then, that time stamp
        // gets turned into a dd/mm/yyyy format
        let currentDate = this.standardDateTo_Date_DDMMYYYY(this.getCurrentDateTime());
        // checks to see if the date is in standard time or dd/mm/yyyy format
        // if it is in standard time format then the length of the string will not be = to 10
        // in that case the dateToCheck is converted into dd/mm/yyyy format
        dateToCheck = this[_ddmmyyyyToStandardDateTimeCheck] (dateToCheck);

        // splits the datetime by "T" and then take index 0 of the array to get yyyy-mm-dd
        // split the yyyy-mm-dd by "-" to get array of ["yyyy","mm","dd"]
        dateToCheck = dateToCheck.split("T")[0].split("-");
        currentDate = currentDate.split("T")[0].split("-");

        // if the the option 'year' is not passed in as an argument the
        // months will be compared by default
        if (monthOrYearOption !== 'year') {
            // returns the evaluation result of the equality between the month data from both arrays
            return dateToCheck[1] === currentDate[1];
        }
        else {
            // returns the evaluation result of the equality between the year data from both arrays
            return dateToCheck[2] === currentDate[2];
        }

    }




    // can pass in date as standard date time format or as dd/mm/yyyy as type string
    // objectContainingTheAddingToMake should be type object can be a negative number to subtract days
    // objectContainingTheAddingToMake: examples: {days : 6} or { months: 9} or {years : 9}
    // can even do any combination: examples: {days : 7, months : 9} or {days : 8, months: 9, years : 2}
    static addToDate (date, objectContainingTheAddingToMake) {
        // if date is in dd/mm/yyyy format it gets changed into the standard date time format the moment.js library can work with
        date = this[_ddmmyyyyToStandardDateTimeCheck] (date);
        // uses the moment library to make relevant changes to the date. The result then gets formatted to the standard
        // date format by using the .format()
        return moment(date).add(objectContainingTheAddingToMake).format();
    }



    // can pass in date as standard date time format or as dd/mm/yyyy as type string
    // objectContainingTheAddingToMake should be type object can be a negative number to subtract days
    // objectContainingTheAddingToMake: examples: {days : 6} or { months: 9} or {years : 9}
    // can even do any combination: examples: {days : 7, months : 9} or {days : 8, months: 9, years : 2}
    static subtractFromDate (date, objectContainingTheSubtractionsToMake) {
        // if date is in dd/mm/yyyy format it gets changed into the standard date time format the moment.js library can work with
        date = this[_ddmmyyyyToStandardDateTimeCheck] (date);
        // uses the moment library to make relevant changes to the date. The result then gets formatted to the standard
        // date format by using the .format()
        return moment(date).subtract(objectContainingTheSubtractionsToMake).format();
    }


    // can pass in date as standard date time format or as dd/mm/yyyy as type string
    static dateToWordedMonth (date) {

        // if date is in dd/mm/yyyy format it gets changed into the standard date time format the moment.js library can work with
        date = this[_ddmmyyyyToStandardDateTimeCheck] (date);
        return moment(date).format("MMMM");
    }




    // method checks to see if the dateToBeChecked is in the past or in the future. dateToBeChecked should type string
    // The argument should be in the standard date format for greater
    // accuracy as time will also be accounted for then but dd/mm/yyyy format will work
    // the method will return true if the date has passed and false if the date is in the future
    static hasDatePassed (dateToBeChecked) {
        let currentDateTime = this.getCurrentDateTime();
        // if date is in dd/mm/yyyy format it gets changed into the standard date time format the moment.js library can work with
        dateToBeChecked = this[_ddmmyyyyToStandardDateTimeCheck] (dateToBeChecked);

        // returns the evaluation of the dates
        return currentDateTime > dateToBeChecked;
    }


    // private method to check if a date is dd/mm/yyyy or standard date time stamp
    // if the date is dd/mm/yyyy format then the date gets changed to the equivalent in
    // the standard date time stamp
    static [_ddmmyyyyToStandardDateTimeCheck] (date) {
        if (date.length === 10) { date = DateHandler.createTimeStamp(date) }
        return date;
    }
}


module.exports = DateHandler;
