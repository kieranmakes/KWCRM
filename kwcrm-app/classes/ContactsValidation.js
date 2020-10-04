const Validation = require("./Validation");


// creating "private" properties for the class by utilising the Symbol function
const _businessName = Symbol("businessName");
const _firstName = Symbol("firstName");
const _lastName = Symbol("lastName");
const _email = Symbol("email");
const _telephone = Symbol("telephone");
const _city = Symbol("city");
const _postcode = Symbol("postcode");
const _address = Symbol("address");
const _status = Symbol("status");


// creating "private" method names for the class by utilising the Symbol function
const _presenceCheck = Symbol("presenceCheck");
const _lengthCheck = Symbol("lengthCheck");
const _stringTypeCheck = Symbol("stringTypeCheck");
const _numberTypeCheck = Symbol("numberTypeCheck");
const _rangeCheck = Symbol("rangeCheck");
const _emailFormatCheck = Symbol("emailFormatCheck");
const _lookUpCheckForStatus = Symbol("lookUpCheckForStatus");
const _basicCharactersOnlyLookUpCheck = Symbol("basicCharactersOnlyLookUpCheck");


class ContactsValidation {

    constructor (businessName, firstName, lastName, email, telephone, city, postcode, address, status) {
        this[_businessName] = businessName;
        this[_firstName] = firstName;
        this[_lastName] = lastName;
        this[_email] = email;
        this[_telephone] = telephone;
        this[_city] = city;
        this[_postcode]= postcode;
        this[_address]= address;
        this[_status] = status;
    }

    // presence check gets done on all the fields
    [_presenceCheck] () {

        let message = "    ____    Please Ensure All Text Fields Have Data Entered    ____    ";


        if (!Validation.presenceCheck(this[_businessName])) {
            return message;
        }
        if (!Validation.presenceCheck(this[_firstName])) {
            return message;
        }
        if (!Validation.presenceCheck(this[_lastName])) {
            return message;
        }
        if (!Validation.presenceCheck(this[_email])) {
            return message;
        }
        if (!Validation.presenceCheck(this[_telephone])) {
            return message;
        }
        if (!Validation.presenceCheck(this[_city])) {
            return message;
        }
        if (!Validation.presenceCheck(this[_postcode])) {
            return message;
        }
        if (!Validation.presenceCheck(this[_address])) {
            return message;
        }
        if (!Validation.presenceCheck(this[_status])) {
            return message;
        }


        return '';
    }


    // checks that the length of the telephone attribute of the class has a length equal to 11 characters
    [_lengthCheck] () {
        if (!Validation.lengthCheck(this[_telephone], 11)){
            return "    ____    Please Ensure The Telephone Length Is 11 Characters Long    ____    ";
        }
        else {
            return '';
        }
    }

    // checks to see if the telephone is comprised of only numbers, if it contains other characters then a message of
    // what is wrong will be returned
    [_numberTypeCheck] () {
        if (!Validation.isaNumber(this[_telephone], true)){
            return "    ____    Please Ensure The Telephone Is Comprised Only Of Number Characters    ____    ";
        }
        else {
            return '';
        }
    }



    // type check gets done on all the fields to check that the value is of type string
    [_stringTypeCheck] () {

        let message = "    ____    Please Ensure All Text Fields Are Of Type String    ____    ";

        // if any of the text fields are not of type string then the message will get returned
        if (!Validation.isaString(this[_businessName])) {
            return message;
        }
        if (!Validation.isaString(this[_firstName])) {
            return message;
        }
        if (!Validation.isaString(this[_lastName])) {
            return message;
        }
        if (!Validation.isaString(this[_email])) {
            return message;
        }
        if (!Validation.isaString(this[_telephone])) {
            return message;
        }
        if (!Validation.isaString(this[_city])) {
            return message;
        }
        if (!Validation.isaString(this[_postcode])) {
            return message;
        }
        if (!Validation.isaString(this[_address])) {
            return message;
        }
        if (!Validation.isaString(this[_status])) {
            return message;
        }

        // if no messages have been returned, the method will return an empty string
        return '';
    }

    // range check done on
    [_rangeCheck] () {

        let message = '';

        // if text field does not contain a set of data within the string length range a message will get returned
        if (!Validation.rangeCheck(this[_businessName], 1, 25,true)) {
            message += "    ____    Ensure That The Business Name Field Is Within Range Of 1 - 25 Characters    ____    ";
        }
        if (!Validation.rangeCheck(this[_firstName], 1, 15,true)) {
            message += "    ____    Ensure That The First Name Field Is Within Range Of 1 - 15 Characters    ____    ";
        }
        if (!Validation.rangeCheck(this[_lastName], 1, 15,true)) {
            message += "    ____    Ensure That The Last Name Field Is Within Range Of 1 - 15 Characters    ____     ";
        }
        if (!Validation.rangeCheck(this[_email], 4, 30,true)) {
            message += "    ____    Ensure That The Email Field Is Within Range Of 4 - 30 Characters    ____    ";
        }
        if (!Validation.rangeCheck(this[_city], 1, 15,true)) {
            message += "    ____    Ensure That The City Field Is Within Range Of 1 - 15 Characters    ____    ";
        }
        if (!Validation.rangeCheck(this[_postcode], 4, 12,true)) {
            message += "    ____    Ensure That The Post Code Field Is Within Range Of 4 - 12 Characters    ____    ";
        }
        if (!Validation.rangeCheck(this[_address], 1, 30,true)) {
            message += "    ____    Ensure That The Address Field Is Within Range Of 1 - 30 Characters    ____    ";
        }

        // if no messages have been returned, the method will return an empty string
        return message;
    }


    [_emailFormatCheck] () {
        if (!Validation.emailFormat(this[_email])){
            return "    ____    Please Ensure The Email Is Valid    ____    ";
        }
        else {
            return '';
        }
    }

    // does a look up check to ensure that the contact status is one of the acceptable values
    [_lookUpCheckForStatus] () {
        let acceptableValues = ['lead', 'dead-lead', 'recontact-lead', 'client', 'past-client'];
        if (!Validation.comparisonCheck(this[_status], acceptableValues)) {
            return '    ____    Ensure That The Contact Status Is One Of The Acceptable Values    ____    ';
        }
        else {
            return '';
        }
    }


    // Only allows basic characters to be accepted validation done to help circumvent XSS and the user typing commas
    [_basicCharactersOnlyLookUpCheck] () {

        let message = "    ____    Ensure That All Fields  Other Than Email Only Contain a-z, A-Z , Spaces, And 0-9 Characters    ____    ";


        if (!Validation.checkStringIsMadeOfOnlyLowerUpperAndNumberChars(this[_businessName], true)) {
            return message;
        }
        if (!Validation.checkStringIsMadeOfOnlyLowerUpperAndNumberChars(this[_firstName], true)) {
            return message;
        }
        if (!Validation.checkStringIsMadeOfOnlyLowerUpperAndNumberChars(this[_lastName], true)) {
            return message;
        }

        if (!Validation.checkStringIsMadeOfOnlyLowerUpperAndNumberChars(this[_telephone], true)) {
            return message;
        }
        if (!Validation.checkStringIsMadeOfOnlyLowerUpperAndNumberChars(this[_city], true)) {
            return message;
        }
        if (!Validation.checkStringIsMadeOfOnlyLowerUpperAndNumberChars(this[_postcode], true)) {
            return message;
        }
        if (!Validation.checkStringIsMadeOfOnlyLowerUpperAndNumberChars(this[_address], true)) {
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
        outputMessage += this[_lengthCheck]();
        outputMessage += this[_numberTypeCheck]();
        outputMessage += this[_stringTypeCheck]();
        outputMessage += this[_lookUpCheckForStatus]();
        outputMessage += this[_rangeCheck]();
        outputMessage += this[_emailFormatCheck]();
        outputMessage += this[_basicCharactersOnlyLookUpCheck]();


        // if the output message is comprised of just empty strings then the return value will be true
        if (!Validation.presenceCheck(outputMessage)){
            return true;
        }

        // if there is more than an empty string in the output message the message will be returned
        return outputMessage;
    }








}

module.exports = ContactsValidation;
