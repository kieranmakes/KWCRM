// utility functions so that I can avoid adding things to the prototype object of the String object
// as this could result in conflict with other properties

function StringUtility() {}

// static method (can be called without making an instance of the class in other objects, functions and classes)
// turns the first character of every word separated by a space into a capital letter if it is already lower case and a-z

StringUtility.capitalizeString = (inputString) => {

    let words = inputString.split(" ");
    let currentWordsCharacters = [];

    let lowerCaseArray = "abcdefghijklmnopqrstuvwxyz".split("");
    let upperCaseArray = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    for (let i = 0; i < words.length; i++) {
        currentWordsCharacters = words[i].split(""); // splits the current word into an array of characters

        // compare character to all the characters in the lowerCaseArray, if no match is found
        // don't do anything with it.

        for (let x = 0; x < 26; x++) {
            // if match is found, replace that character element with the
            // character stored in the same index but in the upperCaseArray to capitalize it
            if (lowerCaseArray[x] === currentWordsCharacters[0]) {
                currentWordsCharacters[0] = upperCaseArray[x];
                break;
            }
        }
        currentWordsCharacters = currentWordsCharacters.join(""); // puts the characters back together to form the string
        words[i] = currentWordsCharacters; // the capitalized word replaces the non capitalized word in that index of the words array
    }

    words = words.join(" ");
    return words;

};

module.exports = StringUtility;
