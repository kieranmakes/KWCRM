function Validation () {}

const _stringLookupCheckForLowerCase = Symbol('stringLookupCheckForLowerCase');
const _stringLookupCheckForUpperCase = Symbol('stringLookupCheckForUpperCase');
const _stringLookupCheckForNumbers = Symbol('stringLookupCheckForNumbers');
const _stringLookupCheckForSpaces = Symbol('stringLookupCheckForSpaces');

Validation.presenceCheck = (value) => {
    return !(value === undefined || value === null || /^\s*$/.test(value));
};

Validation.lengthCheck = (value, length) => {
  return value.length === length;
};

Validation.rangeCheck = (value, lower, upper, stringLengthInRange) => {
    if (typeof value === "string"){
        if (stringLengthInRange) {
            value = value.length;
        }
        else {
            value = Number(value);
        }
    }

    if (upper === undefined || upper === null) {
        upper = lower;
    }

    return (value >= lower && value <= upper );

};

// checks if the value type is number
// the stringToNumberConversionNeeded parameter should take a boolean value
// if it is set to true then the string will get converted into a number before being checked
Validation.isaNumber = (value, stringToNumberConversionNeeded) => {

    if (stringToNumberConversionNeeded === true) {
        value = Number(value);
    }

    return typeof(value) === "number" && !isNaN(value);
};


Validation.isaInt = (value) => {
    return typeof(value) === "number" && !isNaN(value) && value % 1 === 0;
};

Validation.isaReal = (value) => {
    return typeof(value) === "number" && !isNaN(value) && value % 1 !== 0;
};

Validation.isaString = (value) => {
    return typeof(value) === "string";
};

Validation.isaBoolean = (value) => {
    return typeof(value) === "boolean";
};

Validation.isaFunction = (value) => {
    return typeof(value) === "function";
};

Validation.isaObject = (value) => {
    return typeof(value) === "object";
};

Validation.isaArray = (value) => {
    return Array.isArray(value);
};

Validation.isaCharacter = (value) => {
    return typeof(value) === "string" && Validation.lengthCheck(value, 1);
};

Validation.fileIsCSV = (file) => {
    let regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv)$/;
    return (regex.test(file));
};

Validation.fileIsTXT = (file) => {
    let regex = /^([a-zA-Z0-9\s_\\.\-:])+(.txt)$/;
    return (regex.test(file.value));
};


// value should be the date entry, futureDate parameter is for a boolean argument
// if futureDate has a true value passed then it will check that the value is
// a date into the future
Validation.dateFormat = (value, futureDate) => {

    let valueArray = [];
    let val = 0;
    let day = "";
    let month = "";
    let year = "";
    let usersCurrentDate = new Date();
    let usersDay = "";
    let usersMonth = "";
    let usersYear = "";
    // an object that stores the maximum number of days
    // any month could have
    let monthAndMaxDay = {
        jan: 31,
        feb: 28 || 29,
        mar: 31,
        apr: 30,
        may: 31,
        jun: 30,
        jul: 31,
        aug: 31,
        sep: 30,
        oct: 31,
        nov: 30,
        dec: 31
    };

    // function inside the static method to check if the day value is within the
    // bounds for that month
    let monthDayChecker = () => {
        let maxDay = 0;

        // uses a switch statement to check all possible cases for the months then gets the max
        // day possible for that month from the monthAndMaxDay object
        // a range check is then done using the maxDay as the inclusive upper bound
        // with 1 being the inclusive lower bound
        switch (month){
            case "01":
                maxDay = monthAndMaxDay.jan;
                if (!Validation.rangeCheck(day, 1, maxDay)){
                    return false;
                }
                break;
            case "02":
                maxDay = monthAndMaxDay.feb;
                if (!Validation.rangeCheck(day, 1, maxDay)){
                    return false;
                }
                break;
            case "03":
                maxDay = monthAndMaxDay.mar;
                if (!Validation.rangeCheck(day, 1, maxDay)){
                    return false;
                }
                break;
            case "04":
                maxDay = monthAndMaxDay.apr;
                if (!Validation.rangeCheck(day, 1, maxDay)){
                    return false;
                }
                break;
            case "05":
                maxDay = monthAndMaxDay.may;
                if (!Validation.rangeCheck(day, 1, maxDay)){
                    return false;
                }
                break;
            case "06":
                maxDay = monthAndMaxDay.jun;
                if (!Validation.rangeCheck(day, 1, maxDay)){
                    return false;
                }
                break;
            case "07":
                maxDay = monthAndMaxDay.jul;
                if (!Validation.rangeCheck(day, 1, maxDay)){
                    return false;
                }
                break;
            case "08":
                maxDay = monthAndMaxDay.aug;
                if (!Validation.rangeCheck(day, 1, maxDay)){
                    return false;
                }
                break;
            case "09":
                maxDay = monthAndMaxDay.sep;
                if (!Validation.rangeCheck(day, 1, maxDay)){
                    return false;
                }
                break;
            case "10":
                maxDay = monthAndMaxDay.oct;
                if (!Validation.rangeCheck(day, 1, maxDay)){
                    return false;
                }
                break;
            case "11":
                maxDay = monthAndMaxDay.nov;
                if (!Validation.rangeCheck(day, 1, maxDay)){
                    return false;
                }
                break;
            case "12":
                maxDay = monthAndMaxDay.dec;
                if (!Validation.rangeCheck(day, 1, maxDay)){
                    return false;
                }
                break;
            default:
                return false;
        }
    };

    // checks that the input is a string and that it has a length of 10 characters
    if(Validation.isaString(value) && Validation.lengthCheck(value, 10)){

        valueArray = value.split(""); // puts the string into an array

        // loops through every element in the array so that checks can be done on date, month and the year part of the date
        for(let i = 0; i < valueArray.length; i++){

            // will be using this a lot so to make it more readable, the current array element is set to the variable val
            val = valueArray[i];

            // the 2 an 5 indexes in the array should be a '/' if they aren't false is returned
            if(i === 2 || i === 5){
                if(val !== "/"){
                    return false;
                }
            }
            else {

                // checks that any other character is a number value, if it isn't false is returned
                if (!Validation.isaNumber(Number(val))){
                    return false;
                }
            }
        }

        // sets the day, month and year variables to the relevant characters
        day = valueArray[0] + valueArray[1];
        month = valueArray[3] + valueArray[4];
        year = valueArray[6] + valueArray[7] + valueArray[8] + valueArray[9];

        // check that the day is between 1 and 31 inclusive, return false if it is not
        if (!Validation.rangeCheck(day, 1, 31)){
            return false;
        }
        
        // check that the month is between 1 and 12 inclusive, if it is not then return false
        if (!Validation.rangeCheck(month, 1, 12)){
            return false;
        }
        
        // check that the day is in the range for that month
        monthDayChecker();

        if (futureDate !== true) {
            return true;
        }
        else { // if the future date is needed

            // set variables fot the users current system date
            usersDay = usersCurrentDate.getDate();
            usersMonth = usersCurrentDate.getMonth() + 1;
            usersYear = usersCurrentDate.getFullYear();

            // check that the date entered is one for the future
            if (Number(year) > usersYear){ return true; }
            if (Number(year) === usersYear){
                if (Number(month) > usersMonth){ return true; }
                if (Number(month) === usersMonth) {
                    return (Number(day) >= usersDay); // returns true if the entered date is in the future or is the current day
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }

        }

    }
    else {
        return false;
    }
};

Validation.timeFormat_HHMM = (value) => {

    let valueArray = [];
    let val = 0;
    let hour, minute;

    // checks that the input is a string and that it has a length of 5 characters
    if(Validation.isaString(value) && Validation.lengthCheck(value, 5)) {

        valueArray = value.split(""); // puts the string into an array

        // loops through every element in the array so that checks can be done on the hour and minute parts of the time
        for (let i = 0; i < valueArray.length; i++) {

            // will be using this a lot so to make it more readable, the current array element is set to the variable val
            val = valueArray[i];

            // the 2 index in the array as the element should be a ':' if it is not, false is returned
            if (i === 2) {
                if (val !== ":") {
                    return false;
                }
            }
            else {

                // checks that any other character is a number value, if it isn't false is returned
                if (!Validation.isaNumber(Number(val))) {
                    return false;
                }
            }
        }

        hour = valueArray[0] + valueArray[1];
        minute = valueArray[3] + valueArray[4];

        return ((Number(hour) >= 0 && Number(hour) <= 23 && Number(minute) >= 0  && Number(minute) <= 59));
    }
    else {
        return false;
    }
};

Validation.emailFormat = (value) => {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ;
    return emailRegex.test(value);
};


Validation.timeFormat_HHMMSS = (value) => {

    let valueArray = [];
    let val = 0;
    let hour, minute, second;

    // checks that the input is a string and that it has a length of 5 characters
    if(Validation.isaString(value) && Validation.lengthCheck(value, 8)) {

        valueArray = value.split(""); // puts the string into an array

        // loops through every element in the array so that checks can be done on the hour and minute parts of the time
        for (let i = 0; i < valueArray.length; i++) {

            // will be using this a lot so to make it more readable, the current array element is set to the variable val
            val = valueArray[i];

            // the 2 index in the array as the element should be a ':' if it is not, false is returned
            if (i === 2 || i === 5) {
                if (val !== ":") {
                    return false;
                }
            }
            else {

                // checks that any other character is a number value, if it isn't false is returned
                if (!Validation.isaNumber(Number(val))) {
                    return false;
                }
            }
        }

        hour = valueArray[0] + valueArray[1];
        minute = valueArray[3] + valueArray[4];
        second = valueArray[6] + valueArray[7];

        if (hour === "00" && minute === "00"){

        }

        return ((Number(hour) >= 0 && Number(hour) <= 23 && Number(minute) >= 0  && Number(minute) <= 59
            && Number(second) >= 0  && Number(second) <= 59));
    }
    else {
        return false;
    }
};


// EXAMPLE OF A POLYMORPHIC METHOD
// value two can be an array to check valueOne against multiple values in
// the valueTwo argument. although valueTwo can be a single value to check equality
Validation.comparisonCheck = (valueOne, valueTwo) => {
    if (typeof valueTwo === "object") {
        let foundMatchFlag = false;
        // iterate through the array and compare valueOne to all the values in the array, if one matches then return true
        // if there's no matches return false
        for (let i = 0; i < valueTwo.length; i ++) {
            if (valueOne === valueTwo[i]) {
                foundMatchFlag = true;
            }
        }
        return foundMatchFlag;

    } else { // if valueTwo is not an array then check for equality on the single value
        return valueOne === valueTwo;
    }

};


// preforms a look up check on the string comparing every character in the argument string
// to an array of acceptable characters. true is returned if there is a match found in the string to the list of
// acceptable characters, false returned if there is no match.
Validation[_stringLookupCheckForLowerCase] = (stringValue) => {
    let lowerCaseFlag = false;
    // all possible lower case letters put into an array of characters
    let lowerCaseArray = "abcdefghijklmnopqrstuvwxyz".split("");
    // The stringValue argument gets split up into an array of characters
    let stringArray = stringValue.split("");
    let currentCharacter = '';

        // check for a lower case character in the stringValue
        // by iterating through the stringArray and checking to see if a value matches any value in the lowerCaseArray
        // this is achieved through using a NESTED FOR LOOP
        for (let i = 0; i < stringArray.length; i++) {
            currentCharacter = stringArray[i];
            for (let j = 0; j < lowerCaseArray.length; j++) {
                // if a value in the stringArray matches the value in the lowerCaseArray, set the lowerCaseFlag to true
                if ( currentCharacter === lowerCaseArray[j] ) {
                    lowerCaseFlag = true;
                }
            }
        }
        // if the lowerCaseFlag is still set to false after the loop, then a lowerCase character doesn't exist, false is returned
    return lowerCaseFlag;
};


// preforms a look up check on the string comparing every character in the argument string
// to an array of acceptable characters. true is returned if there is a match found in the string to the list of
// acceptable characters, false returned if there is no match.
Validation[_stringLookupCheckForUpperCase] = (stringValue) => {
    let upperCaseFlag = false;
    // all possible upper case letters put into an array of characters
    let upperCaseArray = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    // The stringValue argument gets split up into an array of characters
    let stringArray = stringValue.split("");
    let currentCharacter = '';

    // check for a upper case character in the stringValue
    // by iterating through the stringArray and checking to see if a value matches any value in the upperCaseArray
    // this is achieved through using a NESTED FOR LOOP
    for (let i = 0; i < stringArray.length; i++) {
        currentCharacter = stringArray[i];
        for (let j = 0; j < upperCaseArray.length; j++) {
            // if a value in the stringArray matches the value in the upperCaseArray, set the upperCaseFlag to true
            if ( currentCharacter === upperCaseArray[j] ) {
                upperCaseFlag = true;
            }
        }
    }
    // if the upperCaseFlag is still set to false after the loop, then an upperCase character doesn't exist, false is returned
    return upperCaseFlag;
};


// preforms a look up check on the string comparing every character in the argument string
// to an array of acceptable characters. true is returned if there is a match found in the string to the list of
// acceptable characters, false returned if there is no match.
Validation[_stringLookupCheckForNumbers] = (stringValue) => {
    let numbersFlag = false;
    // all possible number characters  put into an array of characters
    let numbersArray = "1234567890".split("");
    // The stringValue argument gets split up into an array of characters
    let stringArray = stringValue.split("");
    let currentCharacter = '';

    // check for a number character in the stringValue
    // by iterating through the stringArray and checking to see if a value matches any value in the numbersArray
    // this is achieved through using a NESTED FOR LOOP
    for (let i = 0; i < stringArray.length; i++) {
        currentCharacter = stringArray[i];
        for (let j = 0; j < numbersArray.length; j++) {
            // if a value in the stringArray matches the value in the numbersArray, set the numbersFlag to true
            if ( currentCharacter === numbersArray[j] ) {
                numbersFlag = true;
            }
        }
    }
    // if the numbersFlag is still set to false after the loop, then a number character doesn't exist, false is returned
    return numbersFlag;
};


// preforms a look up check on the string comparing every character in the argument string
// to a space character. true is returned if there is a match found in the string, false returned if there is no match.
Validation[_stringLookupCheckForSpaces] = (stringValue) => {
    let spaceFlag = false;
    // the comparison space character
    let spaceCharacter = " ";
    // The stringValue argument gets split up into an array of characters
    let stringArray = stringValue.split("");
    let currentCharacter = '';

    // check for a space character in the stringValue
    // by iterating through the stringArray and checking to see if a value matches any value in the spaceCharacter
    for (let i = 0; i < stringArray.length; i++) {
        currentCharacter = stringArray[i];
        if (currentCharacter === spaceCharacter) {
            spaceFlag = true;
        }
    }
    // if the spaceFlag is still set to false after the loop, then a space character doesn't exist, false is returned
    return spaceFlag;
};


// preforms a look up check on the string comparing every character in the argument string
// to a comma character. true is returned if there is a match found in the string, false returned if there is no match.
Validation.stringLookupCheckForCommas = (stringValue) => {
    let commaFlag = false;
    // the comparison comma character
    let commaCharacter = ",";
    // The stringValue argument gets split up into an array of characters
    let stringArray = stringValue.split("");
    let currentCharacter = '';

    // check for a number character in the stringValue
    // by iterating through the stringArray and checking to see if a value matches any value in the commaCharacter
    for (let i = 0; i < stringArray.length; i++) {
        currentCharacter = stringArray[i];
        if (currentCharacter === commaCharacter) {
            commaFlag = true;
        }
    }
    // if the commaFlag is still set to false after the loop, then a comma character doesn't exist, false is returned
    return commaFlag;
};


Validation.stringLookupCheck = (stringValue, objectOfWhatNeedsToBeInTheString) => {

    // if there is no object parameter an error message is thrown to
    // notify that an object parameter is needed
    if (objectOfWhatNeedsToBeInTheString === undefined) {
        throw "ERROR NEED TO HAVE AN OBJECT PARAMETER: "
        + "as the second parameter, set options of:\nlowerCase, upperCase, numbers: " +
        " to true \nif you want to check the string contains one of them types of characters ";
    }


    // checks to see if there is a property in the object passed as argument into the method
    // called lowerCase and checks to see if it's value is set to the boolean value true
    if (objectOfWhatNeedsToBeInTheString.lowerCase === true) {
        // preforms lookup check to see if there is any lowerCase characters in the string
        // if there is not then false gets returned
        if(!Validation[_stringLookupCheckForLowerCase](stringValue)){ return false }
    }

    // checks to see if there is a property in the object passed as argument into the method
    // called upperCase and checks to see if it's value is set to the boolean value true
    if (objectOfWhatNeedsToBeInTheString.upperCase === true) {
        // preforms lookup check to see if there is any upperCase characters in the string
        // if there is not then false gets returned
        if(!Validation[_stringLookupCheckForUpperCase](stringValue)){ return false }
    }

    // checks to see if there is a property in the object passed as argument into the method
    // called numbers and checks to see if it's value is set to the boolean value true
    if (objectOfWhatNeedsToBeInTheString.numbers === true) {
        // preforms lookup check to see if there is any number characters in the string
        // if there is not then false gets returned
        if(!Validation[_stringLookupCheckForNumbers](stringValue)){ return false }
    }

    // if false hasn't been returned yet then the string must contain all criteria
    return true;

};

// method checks that the string passed in as an argument only contains lower case characters, upper case characters
// or number characters. if a character is found in the string that is not one of them, then the method returns false
// if all characters in the string that is passed as argument are either upper, lower or numbers then true is returned
Validation.checkStringIsMadeOfOnlyLowerUpperAndNumberChars = (stringValue, allowSpaces) => {
    // iterate through each character in the string checking if it is a number, lowercase char or an uppercase char
    let curChar = '';
    let charArray = stringValue.split(""); // puts the string into an array of its characters
    for (let i = 0; i < charArray.length; i++) {

        curChar = charArray[i];

        if (allowSpaces === true) {
            // if all of the checks come back false, false is returned
            if ((!Validation[_stringLookupCheckForLowerCase](curChar))
                && (!Validation[_stringLookupCheckForUpperCase](curChar))
                && (!Validation[_stringLookupCheckForNumbers](curChar))
                && (!Validation[_stringLookupCheckForSpaces](curChar)))
            {
                return false;
            }
        }

        else {
            // if all of the checks come back false, false is returned
            if ((!Validation[_stringLookupCheckForLowerCase](curChar))
                && (!Validation[_stringLookupCheckForUpperCase](curChar))
                && (!Validation[_stringLookupCheckForNumbers](curChar)))
            {
                return false;
            }
        }

    }

    // loop has finished, if false hasn't been returned it means that all the characters
    // in the string consist of either a number, lowercase char or an uppercase char
    return true;
};





module.exports = Validation;

