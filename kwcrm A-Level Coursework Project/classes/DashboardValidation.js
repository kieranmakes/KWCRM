const Validation = require("./Validation");


// creating "private" properties for the class by utilising the Symbol function
const _date = Symbol("date");
const _time = Symbol("time");
const _subject = Symbol("subject");
const _message = Symbol("message");


// creating "private" method names for the class by utilising the Symbol function
const _presenceCheck = Symbol("presenceCheck");
const _stringTypeCheck = Symbol("stringTypeCheck");
const _rangeCheck = Symbol("rangeCheck");
const _timeFormatCheck = Symbol("timeFormatCheck");
const _dateFormatCheck = Symbol("dateFormatCheck");
const _basicCharactersOnlyLookUpCheck = Symbol("basicCharactersOnlyLookUpCheck");


class DashboardValidation {

    constructor (date, time, subject, message) {
        this[_date] = date;
        this[_time] = time;
        this[_subject] = subject;
        this[_message] = message;
    }

    // presence check gets done on all the fields
    [_presenceCheck] () {

        let message = "    ____    Please Ensure All Text Fields Have Data Entered    ____    ";


        if (!Validation.presenceCheck(this[_date])) {
            return message;
        }
        if (!Validation.presenceCheck(this[_time])) {
            return message;
        }
        if (!Validation.presenceCheck(this[_subject])) {
            return message;
        }
        if (!Validation.presenceCheck(this[_message])) {
            return message;
        }

        return '';
    }


    // checks that the date is in the format dd/mm/yyyy and that the date entered is either the current date or a date in the future
    [_dateFormatCheck] () {
        if (!Validation.dateFormat(this[_date], true)) {
            return "    ____    Please Ensure The Date Is In The Format dd/mm/yyyy And The Date Is In The Future Or Today's Date   ____    "
        } else {
            return '';
        }
    }

    // checks that the time is in the format hh:mm
    [_timeFormatCheck] () {
        if (!Validation.timeFormat_HHMM(this[_time])) {
            return "    ____    Please Ensure The Time Is In The Format hh:mm Use The 24hr Clock    ____    "
        } else {
            return '';
        }
    }



    // type check gets done on all the fields to check that the value is of type string
    [_stringTypeCheck] () {

        let message = "    ____    Please Ensure All Text Fields Are Of Type String    ____    ";

        // if any of the text fields are not of type string then the message will get returned
        if (!Validation.isaString(this[_date])) {
            return message;
        }
        if (!Validation.isaString(this[_time])) {
            return message;
        }
        if (!Validation.isaString(this[_subject])) {
            return message;
        }
        if (!Validation.isaString(this[_message])) {
            return message;
        }

        // if no messages have been returned, the method will return an empty string
        return '';
    }


    // range check done on
    [_rangeCheck] () {

        let message = '';

        // if text field does not contain a set of data within the string length range a message will get returned
        if (!Validation.rangeCheck(this[_subject], 1, 40, true)) {
            message += "    ____    Ensure That The Subject Field Is Within Range Of 1 - 40 Characters    ____    ";
        }
        if (!Validation.rangeCheck(this[_message], 1, 200,true)) {
            message += "    ____    Ensure That The Message Field Is Within Range Of 1 - 200 Characters    ____    ";
        }


        // if no messages have been returned, the method will return an empty string
        return message;
    }


    // Only allows basic characters to be accepted validation done to help circumvent XSS and the user typing commas
    [_basicCharactersOnlyLookUpCheck] () {

        let message = "    ____    Ensure That The Subject And Message Only Contain a-z, A-Z , And 0-9 Characters    ____    ";


        if (!Validation.checkStringIsMadeOfOnlyLowerUpperAndNumberChars(this[_subject], true)){
            return message;
        }
        if (!Validation.checkStringIsMadeOfOnlyLowerUpperAndNumberChars(this[_message], true)){
            return message;
        }

        return '';
    }





    // the public method that will be called on the instance of the class to  validate it and
    // output any necessary messages if it failed the validation
    checkFieldsAreValid() {

        let outputMessage = '';

        // appends the return message from private methods to the outputMessage variable in teh public method
        outputMessage += this[_presenceCheck]();
        outputMessage += this[_basicCharactersOnlyLookUpCheck] ();
        outputMessage += this[_timeFormatCheck] ();
        outputMessage += this[_stringTypeCheck]();
        outputMessage += this[_dateFormatCheck] ();
        outputMessage += this[_rangeCheck]();


        // if the output message is comprised of just empty strings then the return value will be true
        if (!Validation.presenceCheck(outputMessage)){
            return true;
        }

        // if there is more than an empty string in the output message, the message will be returned
        return outputMessage;
    }

}

module.exports = DashboardValidation;
