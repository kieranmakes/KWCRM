function Encryption(){}

const _generateKey = Symbol('generateKey');

// change all characters from input and key to character codes to store in separate arrays
// xor all input characters by key characters, store xor characters in new array

Encryption[_generateKey] = (key, inputLength) => {
    let keyArray; // used to store key / password as an array of characters
    let difference;
    while (key.length <= inputLength) { // loop to make the key longer or equal to the length of the input text
        key = key + key + "p";
    }
    keyArray = key.split("");

    // stores how much longer the length of the key is to the input
    difference = keyArray.length - inputLength;

    // loop to get rid of last element in the array each time to make length of keyArray == inputArray
    for (let i = 0; i < difference; i++){
        keyArray.pop();
    }
    return keyArray;
};


Encryption.xorEncrypt = (input, key) => {
    let inputArray = input.split(""); // puts input into an array of characters
    let keyArray = []; // used to store key / password as an array of characters
    let xorValues = [];
    keyArray = Encryption[_generateKey](key, input.length);

    // replace all characters in their element with a character code for inputArray and keyArray
    // preform xor on the elements, storing the answers in the xorValues Array
    for (let i = 0; i < keyArray.length; i++) {
        keyArray[i] = keyArray[i].charCodeAt(0).toString();
        inputArray[i] = inputArray[i].charCodeAt(0).toString();
        xorValues[i] = keyArray[i] ^ inputArray[i]; // preforms the xor on both characters from the key and the input
    }

    //makes the last number of the coma separated string, the length of original message
    // and puts double quotes around the string so that it can be saved to the
    // csv file without causing disruption to the rest of the file
    return  xorValues.join("/") + "/" + (input.length).toString() ;
};


// Static method that can be called anywhere in my code
Encryption.xorDecrypt = (input, key) => { // input needs to be comma separated integers as one string.
    let inputArray = input.split("/"); // splits the input array up into an array of the numbers
    let keyArray = [];
    let xorValues = [];
    let decryptedTextArray = [];

    // gets length of input before it was encrypted and stores it in a constant
    const INPUT_LENGTH_BEFORE_ENCRYPTION = inputArray[(inputArray.length-1)];
    inputArray.pop(); // gets rid of the length of original text element
    keyArray = Encryption[_generateKey](key, INPUT_LENGTH_BEFORE_ENCRYPTION);

    for (let i = 0; i < keyArray.length; i++) {
        keyArray[i] = keyArray[i].charCodeAt(0).toString();
        xorValues[i] = keyArray[i] ^ inputArray[i]; // preforms the xor on both characters from the key and the input

        // gets the character code from the xor result, turns it into a string and then puts it into the decryptedTextArray
        decryptedTextArray[i] = String.fromCharCode(xorValues[i]);

    }

    return (decryptedTextArray.join("")); // decrypted text gets returned


};

module.exports = Encryption;


// // Test code
//
// let text  = "hey";
// let password = "wowww";
// let fakePass = "wowx";
//
//
// let encryptedText = Encryption.xorEncrypt(text, password);
// let decryptedText = Encryption.xorDecrypt(encryptedText, fakePass);
//
// console.log(`text: ${text} \npassword: ${password} \nencrypted text: ${encryptedText} \ndecrypted text: ${decryptedText}`);