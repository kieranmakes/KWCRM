"use strict";

const
    fs = require("fs"),
    path = require('path'),
    uniqueID = require('uniqid'),
    Sort = require("./Sort"),
    Search = require("./Search"),
    DateHandler = require("./DateHandler");


// way of imitating private methods and variables as the JS does not have a
// a way to define them yet. Done by differentiating the way
// they are accessed. It isn't, accessible through the object model
// of the class like you would expect the method or variable to be.
// This is done so that it is clear what is meant to be accessible and
// what is not, from outside the class. Even tho the IDE won't
// suggest the methods or variables, it is still possible to
// access them. And so, this is not perfect but better than nothing.

const _csvToTxt = Symbol('csvToTxt');
const _txtToCsv = Symbol('txtToCsv');
const _csvToArray = Symbol('txtInCsvFormatToArray');
const _FILE_PATH = Symbol('filePath');
const _rewriteDataToFileWithChanges = Symbol('rewriteDataToFileWithChanges');
const _generateID = Symbol('generateID');
const _makeChangesToRecord = Symbol('makeChangesToRecord');
const _getLastRecordItem = Symbol('_getLastRecordItem');


class CSVHandler {

    constructor(filePath) {
        // private property of the class
        this[_FILE_PATH] = filePath;
    }

    // these functions are used to change the
    // file from a csv file to a txt file or vice versa
    // these are private methods
    [_csvToTxt]() {
        return path.basename(this[_FILE_PATH], '.txt');
    }

    [_txtToCsv]() {
        return path.basename(this[_FILE_PATH], '.csv');
    }

    // will put a txt file that is in a csv format into a 2d array and return it
    [_csvToArray]() {
        let file = fs.readFileSync(this[_FILE_PATH], 'utf8');
        let recordsArray = file.split("\n");
        let csvInArray = [];

        // there is an empty array element at the end of each record
        // in this loop every record has the empty element removed and the rest of the
        // array gets put back into the csvInArray array.
        for (let i = 0; i < recordsArray.length; i++) {
            let singleRecordArray = recordsArray[i].split(",");
            singleRecordArray.pop(); // gets rid of the empty last element in the array
            csvInArray.push(singleRecordArray);
        }
        return csvInArray;
    }


    // returns all records stored in the file
    getAllRecords () {
        let arrayOfRecords = this[_csvToArray]();
        arrayOfRecords.pop();
        return arrayOfRecords;
    }


    // used to find a record by it's id
    // requires only the id to retrieve the record
    selectRecordByID(id) {
        let array = this[_csvToArray]();
        array.pop();

        let recordFoundByID = Search.binarySearch2D(array, [0], id); // Stores the record found.

        // function done on recordFoundByID in the return is done to flatten the array
        // Output would be a multi dimensional array otherwise containing just one record.
        return [].concat.apply([], recordFoundByID)
    }

    // searches for a record to return based off of a search value
    // will check all columns entered to see if there is a match in a any of them
    // columnsToSearch parameter should be an array of numbers that represent the index's of the columns to be searched
    // the search value should be a sting
    selectRecordByField(columnsToSearch, searchValue) {
        let arrayOfRecords = this[_csvToArray]();

        arrayOfRecords.splice(arrayOfRecords.length - 1, 1);
        return Search.binarySearch2D(arrayOfRecords, columnsToSearch, searchValue)
    }

    // will return a number for how many matches were found in that column for the searchValue
    // columnsToSearch parameter should be an array of numbers that represent the index's of the columns
    // to be searched. The search value should be a sting.
    countMatches (columnsToSearched, searchValue) {
        return this.selectRecordByField(columnsToSearched, searchValue).length;
    }

    // returns only the records found that match the searchValue
    // unlike the selectRecordByField which returns an array of objects
    getRecordsOnlyByField (columnsToSearch, searchValue) {
        let arrayOfRecordsAndIndexsObj = this.selectRecordByField(columnsToSearch, searchValue);
        let arrayORecordsOnly = [];
        for (let i = 0; i < arrayOfRecordsAndIndexsObj.length; i++) {
            arrayORecordsOnly.push(arrayOfRecordsAndIndexsObj[i].record)
        }
        return arrayORecordsOnly;
    }


    // The generateUniqueID variable will make this a polymorphic method as it will run differently dependent on
    // the argument that gets passed for it.
    // the data argument should be an array of all the data contained in a record
    addRecord(data, generateUniqueID, noTimeInTimeStamp) { // no time in time stamp allows the user to make a time stamp with no time elements in it

        let arrayOfRecords = this[_csvToArray]();
        let arrayHolder = [];
        let currentDateTime;


        // if there is no argument passed in the generateUniqueID parameter
        // the it's default value will be set to undefined which would be interpreted as
        // false by the if statements. Because this method is more likely to be used
        // to create a unique id when a record is being added, it makes sense for it to be true when
        // the user is creating a record and leaves out that argument. Also done to aid readability as
        // I could have named it doNotGenerateId but parameters aren't typically named like that

        if (generateUniqueID === undefined) {
            generateUniqueID = true;
        }

        if (generateUniqueID) {
            // generate the unique id, has to be declared down here so it does not
            // interfere with the UniqueIdGenerator class when it accesses the
            // addRecord method
            const ID = this[_generateID](); // generates a unique id value

            if (noTimeInTimeStamp === true) { // sets appropriate date time stamp dependent on argument passed in
                currentDateTime = DateHandler.getCurrentDate();
            } else {
                currentDateTime = DateHandler.getCurrentDateTime();
            }


            let recordWithDateStampAndID = [ID, currentDateTime];
            // add record
            data.forEach((field) => {
                recordWithDateStampAndID.push(field);
            });
            // console.log(recordWithDateStampAndID);
            // removes the empty last element in the array caused by the empty new line
            // .pop() resulted in the entire array got cleared for some reason so this is the
            // work around
            arrayOfRecords.splice(arrayOfRecords.length - 1);
            arrayOfRecords.push(recordWithDateStampAndID);
            // console.log( arrayOfRecords);
            this[_rewriteDataToFileWithChanges](arrayOfRecords);

        }

        // used by the unique id generator private method
        else {
            arrayOfRecords.pop();
            arrayHolder.push(data);
            // takes the 2D array 'arrayOfRecords' and appends the new record to the end of it
            arrayOfRecords.push(arrayHolder);
            // rewrite the array of records with the appended record to the file
            this[_rewriteDataToFileWithChanges](arrayOfRecords);
        }
    }


    deleteRecord(id) {
        let arrayOfRecords = Sort.bubbleSort2D(this[_csvToArray](), 0);
        arrayOfRecords.splice(arrayOfRecords.length - 1);
        //exception handling so program doesn't crash if the delete was not possible
        try{
            arrayOfRecords.splice(Search.binarySearch2D(arrayOfRecords, [0], id)[0].index, 1); // deletes
        }
        catch(e) {
            console.error(`record was not able to be deleted: check record with that id (${id}) exists\n`);
            console.error(e)
        }
        // arrayOfRecords is parsed back into the file without
        // the record with the id passed as argument
        // unless the record was not able to be deleted, then all
        // records will get parsed back into the original csv file
        this[_rewriteDataToFileWithChanges](arrayOfRecords);
    }



    // arrayOfEdits format: [["col that needs to be edited", "new data"], ... , ["col that needs to be edited", "new data"]]
    // arrayOfEdits = [["1", "james"],["2", "doug"]];
    // example of method calling code: users.editRecord("32", [["1","james"], ["2", "jones"]]);
    // id should be of string type
    editRecord(id, arrayOfEdits) {
        // file gets turned to 2d array ad then sorted by the id column
        let arrayOfRecords = Sort.bubbleSort2D(this[_csvToArray](), 0);
        arrayOfRecords.splice(arrayOfRecords.length - 1); // removes last element in array because it is empty
        // find record by id and returns a javascript object: {record: [record data], index: index record is in 2d array}
        // the [0] is at the end because it is returned contained in an array
        let recordObject = Search.binarySearch2D(arrayOfRecords, [0], id)[0];
        // puts the object values into variables
        let index = recordObject.index;
        let record = recordObject.record;

        // calls the makeChangesToRecord private method and then
        // stores that new record in the place of the old record
        arrayOfRecords[index] = this[_makeChangesToRecord](record, arrayOfEdits);
        // rewrites the 2D array to a the csv file.
        this[_rewriteDataToFileWithChanges](arrayOfRecords);
    }


    // method that will return the last record in the file
    [_getLastRecordItem]() {
        let arrayOfRecords = this[_csvToArray]();
        let arrLength = arrayOfRecords.length;
        // to access last record, the element has to be length - 2 because
        // arrays start from 0 and then the other -1 comes form the fact that it counts the new line.
        return arrayOfRecords[arrLength - 2];
    }


    // takes a 2d array as a argument, will write the 2D Array to the file.
    // works by deleting all data contained in the file and then writing all the data in the
    // 2D array to the text file.
    [_rewriteDataToFileWithChanges](array2D) {

        // remove all data stored in the file
        // call back to carry out further tasks after the data has been erased
        fs.writeFile(this[_FILE_PATH], '', (err) => {
            if (err) {
                console.log(err);

            }
            else {
                // rewrite data to file
                let record = [];
                //iterates through the length of the array (number of records in the array)
                for (let i = 0; i < array2D.length; i++) {
                    record = array2D[i].join(","); // joins the record  into a string separated with a comma
                    // writes a record to the file in format of:
                    // 'comma separated record data' + "," + new line
                    // call back to output that the data has been re-written successfully or an error
                    // message outlining the error
                    fs.appendFileSync(this[_FILE_PATH], `${record},\n`);
                }
            }
        });

    }

    deleteAllRecords () {
        fs.writeFile(this[_FILE_PATH], '', (err) => {
            console.log(err);
        });
    }

    // column to sort by should be a number of the index of the field that will get sorted
    // ascending should be set to true or false depending you want the 2d array to be in
    // ascending order: true or descending order: false
    // if the ascending parameter has no value passed as argument, it will sort it in ascending order
    // as that is how I defined the method in the sort class.
    sortBy (columnToSortBy, ascending) {
         let sortedArray = Sort.bubbleSort2D(this[_csvToArray](), columnToSortBy, ascending);
         sortedArray.pop(); // gets rid of the empty element at the end of the array
         return sortedArray;
    }





    [_generateID]() {
        // could use this but there is no point of taking up extra server space so I am using a trusted unique Id generator package
        // let idFile = new CSVHandler(__dirname + "/dataStoreFiles/IDs.csv"); // create an instance of the CSVHandler class
        //         // let lastID = idFile.getLastRecordItem()[0]; // get last id number stored in the csv file
        //         // let newID = parseInt(lastID) + 1; // set id to that value + 1
        //         // // if the new id comes back as not a number due to there being no number returned from the file
        //         // // then make new id = 1;
        //         // if (isNaN(newID)) {
        //         //     newID = 1;
        //         // } // only time this module wont work is when the IDs.csv file has no lines in it at all
        //         // // to fix - press the return key in the csv file to add a blank line
        //         // idFile.addRecord(newID, false); // add id just generated to the csv file
        //         // return newID.toString();
        return uniqueID();
    };


    // this private method makes changes to a single record
    // record should be an array of a single record
    // arrayOfEdits should be a 2D array containing arrays of changes
    // arrayOfEdits format: [["col that needs to be edited", "new data"], ... , ["col that needs to be edited", "new data"]]
    // example data: record = ["101","kieran","williams"]; edits = [["1", "james"],["2", "doug"]];

    [_makeChangesToRecord](record, arrayOfEdits) {
        //initialize the variables
        let col = "";
        let newData = "";

        arrayOfEdits.forEach((edit) => {
            col = parseInt(edit[0]);
            // makes sure that the column is not 0 because if it is, it will be possible
            // to change the id field of a record which is something that should not ever happen
            if (col !== 0) {
                newData = edit[1];
                record[col] = newData;
            }
        });
        return record;
    }


}

module.exports = CSVHandler;
