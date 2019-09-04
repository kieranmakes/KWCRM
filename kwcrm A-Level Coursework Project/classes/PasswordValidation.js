const Validation = require("./Validation");


// creating "private" properties for the class by utilising the Symbol function
const _password = Symbol("password");
const _confirmPassword = Symbol("confirmPassword");


// creating "private" method names for the class by utilising the Symbol function
const _presenceCheck = Symbol("presenceCheck");
const _stringTypeCheck = Symbol("stringTypeCheck");
const _rangeCheck = Symbol("rangeCheck");
const _basicCharactersOnlyLookUpCheck = Symbol("basicCharactersOnlyLookUpCheck");
const _stringLookUpCheck = Symbol("stringLookUpCheck");
const _comparisonCheck = Symbol("comparisonCheck");



class PasswordValidation {

    constructor (password, confirmPassword) {
        this[_password] = password;
        this[_confirmPassword] = confirmPassword;
    }

    // presence check gets done on all the fields
    [_presenceCheck] () {

        let message = "    ____    Please Ensure All Text Fields Have Data Entered    ____    ";


        if (!Validation.presenceCheck(this[_password])) {
            return message;
        }
        if (!Validation.presenceCheck(this[_confirmPassword])) {
            return message;
        }

        return '';
    }



    // type check gets done on all the fields to check that the value is of type string
    [_stringTypeCheck] () {

        let message = "    ____    Please Ensure All Text Fields Are Of Type String    ____    ";

        // if any of the text fields are not of type string then the message will get returned
        if (!Validation.isaString(this[_password])) {
            return message;
        }

        // if no messages have been returned, the method will return an empty string
        return '';
    }


    // range check done on
    [_rangeCheck] () {

        let message = "    ____    Ensure That The password Field Is Within Range Of 8 - 15 Characters    ____    ";

        // if text field does not contain a set of data within the string length range a message will get returned
        if (!Validation.rangeCheck(this[_password], 8, 15, true)) {
            return message;
        }


        // if no messages have been returned, the method will return an empty string
        return '';
    }


    // Only allows basic characters to be accepted validation done to help circumvent XSS and the user typing commas
    [_basicCharactersOnlyLookUpCheck] () {

        let message = "    ____    Ensure That The Note Only Contain a-z, A-Z , And 0-9 Characters    ____    ";


        if (!Validation.checkStringIsMadeOfOnlyLowerUpperAndNumberChars(this[_password], true)){
            return message;
        }

        return '';
    }

    // checks that the password has at least one: uppercase character, lowercase character and number
    [_stringLookUpCheck] () {

        let message = "    ____    Ensure That Password Consists Of At Least One: Uppercase Character, Lowercase Character And Number    ____    ";

        if (!Validation.stringLookupCheck(this[_password], {lowercase: true, uppercase: true, numbers: true})){
            return message;
        }

        return '';
    }


    // checks that the password and confirm password are equal
    [_comparisonCheck] () {
        if (this[_password] !== this[_confirmPassword]){
            return "    ____    Ensure That The Passwords Are Equal    ____    "
        }
        return '';
    }




    // will validate a the password to meet the specified criteria:
    // greater than 8 characters and less than 20 characters , consisting of only numbers,
    // uppercase letters and lowercase letters, and it contains at least one number,
    // at least one number, at least one uppercase letter and at least one lowercase letter
    // a comparison check is done lastly to ensure equality between both fields
    // relevant messages will be returned if the password is not valid
    // true is returned if the password is valid. can do this because JS is a dynamic type language

    // the public method that will be called on the instance of the class to  validate it and
    // output any necessary messages if it failed the validation
    checkFieldsAreValid() {

        let outputMessage = '';

        // appends the return message from private methods to the outputMessage variable in teh public method
        outputMessage += this[_presenceCheck]();
        outputMessage += this[_basicCharactersOnlyLookUpCheck] ();
        outputMessage += this[_stringTypeCheck]();
        outputMessage += this[_rangeCheck]();
        outputMessage += this[_stringLookUpCheck]();
        outputMessage += this[_comparisonCheck]();

        // if the output message is comprised of just empty strings then the return value will be true
        if (!Validation.presenceCheck(outputMessage)){
            return true;
        }

        // if there is more than an empty string in the output message, the message will be returned
        return outputMessage;
    }

}


module.exports = PasswordValidation;

