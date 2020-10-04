const Sort = require("./Sort"); // allows the use of sort methods in this file

function Search(){}


// creates private method
const _binarySearch2DFinder = Symbol('binarySearch2DFinder');
const _checkBoundsForMatches = Symbol('checkBoundsForMatches');



// searches for a value and returns the index the element was found at
// or returns -1 if the search value was not found in the array
// ONLY WORKS ON SORTED ARRAYS
Search.binarySearch = (array, searchValue) => {
    // makes sure that the array is sorted before the search is done
    array = Sort.bubbleSort(array);
    let first = 0;
    let last = array.length;
    let middle = Math.floor((first + last)/2);
    let found = false;
    while((!found) || (first <= last)){
        if(array[middle] === searchValue){
            found = true;
            return middle;
        }
        if(searchValue < array[middle]){
            last = middle - 1;
            middle = Math.floor((first + last)/2);
        }
        if(searchValue > array[middle]){
            first = middle + 1;
            middle = Math.floor((first + last)/2);
        }
    }
    return -1;
};

Search[_checkBoundsForMatches] = (array, middle, col, searchValue) => {
    let matchAtBoundsFoundFlag = true; // set to true so that the loop will start
    let recordsFound = [];
    let upperBounds = middle;
    let lowerBounds = middle;

// the algorithm works in the binary search as any other matches will be found either side of the initial match
// due to a binary search only working on sorted arrays which will result in the matches in conjunction in the array

// loop through upper values
    while (matchAtBoundsFoundFlag === true){

        // set to false so that if no matches are found on the upper bounds from the first match
        // the loop will end.
        matchAtBoundsFoundFlag = false;

        // checks that if the upperBounds was to get increased by one,
        // the program will not crash due to the record not being in the bounds of the array
        if ((upperBounds + 1) > (array.length - 1)) {
            break; // terminate the loop
        }

        if (array[upperBounds + 1][col] === searchValue) { // checks to see if the array element above is a match to the search value
            matchAtBoundsFoundFlag = true; // set back to true so that the loop will run again to check for more matches.
            upperBounds++; // increase value stored in upperBounds variable by 1

            // match to the search value was found so the recordsFound
            // array gets the record and index of record in a javascript object appended to the end of it
            recordsFound.push({ record : array[upperBounds], index : upperBounds });
        }
    }

    matchAtBoundsFoundFlag = true; // reset the flag value so the next loop can run

// loop through lower values
    while (matchAtBoundsFoundFlag === true){

        // set to false so that if no matches are found on the lower bounds of the first match
        // the loop will end.
        matchAtBoundsFoundFlag = false;

        // checks that if the lowerBounds was to get decreased by one,
        // the program will not crash due to the record not being in the bounds of the array
        if ((lowerBounds - 1) < (0)) {
            break; // terminate the loop
        }

        if (array[lowerBounds - 1][col] === searchValue) {
            matchAtBoundsFoundFlag = true; // set back to true so that the loop will run again to check for more matches.
            lowerBounds--; // increase value stored in lowerBounds variable by 1

            // match to the search value was found so the recordsFound
            // array gets the record and index of record in a javascript object appended to the end of it
            recordsFound.push({ record : array[lowerBounds], index : lowerBounds  });
        }
    }

    return recordsFound;
};

// purpose of method is to find a match with the searchValue in a set column
Search[_binarySearch2DFinder] = (array, col, searchValue) => {
    let first = 0;
    let last = array.length;
    let middle = Math.floor((first + last)/2);
    let upperAndLowerBoundMatches = [];
    let recordsFound = [];



    // loop that will keep going until last > first or the matching records are found
    // the array[middle][col] ---> middle is the row that is currently under inspection, col is a constant
    while (first <= last) {

        // to avoid a crash, the program will check to see if middle is greater than the index of the last
        // record and that if it is a negative value. In either instance the loop will be terminated
        if (middle > array.length - 1 || middle < 0){
            break;
        }

        if(array[middle][col] === searchValue){
            //pushes the array and an index contained in a javascript object type
            recordsFound.push({ record : array[middle], index : middle }); // adds the record into records found array

            // finds any matches in the upper and lower bounds of the
            upperAndLowerBoundMatches = Search[_checkBoundsForMatches](array, middle, col, searchValue);

            upperAndLowerBoundMatches.forEach((match) => {
                recordsFound.push(match);
            });
            break; // gets out of loop
        }

        // terminates the loop if the middle value is 0 as it will cause a crash
        // crash is due to the fact that middle will turn into a negative value
        if (middle === 0) {
            break;
        }

        if(searchValue < array[middle][col]){
            last = middle - 1;
            middle = Math.floor((first + last)/2);
        }
        if(searchValue > array[middle][col]){
            first = middle + 1;
            middle = Math.floor((first + last)/2);
        }
    }

    if (recordsFound.length > 0){
        return recordsFound;
    }
};




// returns a 2D array of matching records
// columnsToBeSearched should be an array of integers
// that determines what columns are to be searched
Search.binarySearch2D = (array, columnsToBeSearched, searchValue) => {

    let recordsFoundInAllColumnsSearched = [];
    let recordsFoundInOneColumn = [];
    let col = 0;

    // if there is only one record in the array then there is no point in running any more code


    for (let i = 0; i < columnsToBeSearched.length; i++) {  // goes through all columns that need to be searched

        col = columnsToBeSearched[i]; // col is made equal to the i index of the columnsToBeSearched array

        // sorts the array with regard to the column that is being searched on
        array = Sort.bubbleSort2D(array, col);


        recordsFoundInOneColumn = Search[_binarySearch2DFinder](array, col, searchValue);


        // if statement to check that what got returned is an
        // array of records found and not just undefined
        if (recordsFoundInOneColumn !== undefined){
            // goes through every record in the recordsFoundInOneColumnArray
            recordsFoundInOneColumn.forEach((currentRecord) => {
                recordsFoundInAllColumnsSearched.push(currentRecord);
            });

        }

    }
    return recordsFoundInAllColumnsSearched;
};


//searches for a value and returns the index the element was found at
//or returns -1 if the search value was not found in the array

Search.linearSearch = (array, searchValue) => {
    let found = false;
    let i = 0;
    let length = array.length;
    while((!found) || (i < length)){
        if(array[i] === searchValue){
            found = true;
            return i;
        } else {
            i++;
        }
    }
    return -1;
};

Search.getRecords = (ArrayOfObjectsContainingRecordsWithIndexes) => {
    let arrayOfRecords = [];
    ArrayOfObjectsContainingRecordsWithIndexes.forEach((recordWithIndex) => {
        arrayOfRecords.push(recordWithIndex.record);
    });
    return arrayOfRecords;
};

module.exports = Search;


