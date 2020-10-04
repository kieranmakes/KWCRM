const Validation = require("./Validation");


// creating "private" properties for the class by utilising the Symbol function
const _note = Symbol("note");



// creating "private" method names for the class by utilising the Symbol function
const _presenceCheck = Symbol("presenceCheck");
const _stringTypeCheck = Symbol("stringTypeCheck");
const _rangeCheck = Symbol("rangeCheck");
const _basicCharactersOnlyLookUpCheck = Symbol("basicCharactersOnlyLookUpCheck");


class DashboardValidation {

    constructor (note) {
        this[_note] = note;
    }

    // presence check gets done on all the fields
    [_presenceCheck] () {

        let message = "    ____    Please Ensure All Text Fields Have Data Entered    ____    ";


        if (!Validation.presenceCheck(this[_note])) {
            return message;
        }

        return '';
    }



    // type check gets done on all the fields to check that the value is of type string
    [_stringTypeCheck] () {

        let message = "    ____    Please Ensure All Text Fields Are Of Type String    ____    ";

        // if any of the text fields are not of type string then the message will get returned
        if (!Validation.isaString(this[_note])) {
            return message;
        }
        // if no messages have been returned, the method will return an empty string
        return '';
    }


    // range check done on
    [_rangeCheck] () {

        let message = '';

        // if text field does not contain a set of data within the string length range a message will get returned
        if (!Validation.rangeCheck(this[_note], 1, 250, true)) {
            message += "    ____    Ensure That The Subject Field Is Within Range Of 1 - 250 Characters    ____    ";
        }


        // if no messages have been returned, the method will return an empty string
        return message;
    }


    // Only allows basic characters to be accepted validation done to help circumvent XSS and the user typing commas
    [_basicCharactersOnlyLookUpCheck] () {

        let message = "    ____    Ensure That The Note Only Contain a-z, A-Z , And 0-9 Characters    ____    ";


        if (!Validation.checkStringIsMadeOfOnlyLowerUpperAndNumberChars(this[_note], true)){
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
        outputMessage += this[_stringTypeCheck]();
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
