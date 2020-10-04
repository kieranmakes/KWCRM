const
    express = require("express"),
    router = express.Router(),
    CSVHandler = require("../classes/CSVHandler"),
    StringUtility = require('../utilityMethods/StringUtility'),
    DateHandler = require("../classes/DateHandler"),
    Sort = require("../classes/Sort"),
    Encryption = require("../classes/Encryption"),
    PasswordValidation = require("../classes/PasswordValidation"),
    ContactsValidation = require("../classes/ContactsValidation"),
    AddNoteValidation = require("../classes/AddNoteValidation");


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//                                      GET ROUTES

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////





//renders the contacts list page that outputs all the contacts in a table
router.get("/", (req, res) => {
    let contactsFile = new CSVHandler(__dirname + '/dataStoreFiles/contacts.csv');
    let allContactRecords = contactsFile.getAllRecords(); // gets all the contact records and stores in a  2D array
    let message = req.session.message;
    let errorMessage = req.session.errorMessage;

    // an object with a property containing the 2D Array is passed to the ejs template
    // searchValue: undefined allows me to use the same ejs page in the .post("/search") route
    res.render("ContactsList", {contactRecords: allContactRecords, titleAddition: undefined, flashMessage: message, errorMessage: errorMessage},
        function (err, html) {
            req.session.message = undefined;
            req.session.errorMessage = undefined;
            res.send(html);
        });
});


// downloads the contacts file then redirects to the base route
router.get("/download", (req, res) => {

    res.download(__dirname + '/dataStoreFiles/contacts.csv',
        'contactRecords' + ':' + DateHandler.getCurrentDateTime() + '.csv', // sets the name to be contacts records with the current date in with the title
        function(err){
        if (err) {
            console.log(err); // logs the error to the console
        } else {
            console.log("downloaded: " + __dirname + '/dataStoreFiles/contacts.csv');
        }
    });
});




// renders the individual contact page for the contact with the id in the url
router.get("/viewContact:id", (req, res) => {

    let contactsFile = new CSVHandler(__dirname + '/dataStoreFiles/contacts.csv');
    let notesFile = new CSVHandler(__dirname + '/dataStoreFiles/contactsNotes.csv');
    let extraNotesFile = new CSVHandler(__dirname + '/dataStoreFiles/contactsExtraNotes.csv');
    let id = req.params.id;
    // find contact by id to get the contacts record
    let contactDetailsRecord = contactsFile.selectRecordByID(id);


    // gets all the notes relating to the current contact that is being viewed
    // stored in the contactNotes variable as a 2D array with each inner array being a record from the notes csv file
    let contactsNotes = notesFile.getRecordsOnlyByField([3], id);



    let contactsExtraNotes = extraNotesFile.getRecordsOnlyByField([2], id); // gets the contacts extra notes

    contactsNotes = Sort.bubbleSort2D(contactsNotes,[1],false); // sorts the notes ascending by their date time stamp


    if (contactsExtraNotes.length !== 0) { // if there is data in the contacts extra notes 2d array
        contactsExtraNotes = contactsExtraNotes[0][3]; // gets the data from the extra notes data column
    }
    if (req.session.decryptedData !== undefined) {
        contactsExtraNotes = req.session.decryptedData;
    }



    let flashMessage = req.session.message;
    let errorMessage = req.session.errorMessage;

    res.render("ViewIndividualContact",
        {
            contactDetails: contactDetailsRecord[0].record,
            flashMessage: flashMessage,
            errorMessage: errorMessage,
            contactNotes: contactsNotes,
            extraNotes: contactsExtraNotes
        },
        (err, html) => {
        req.session.message = undefined;
        req.session.errorMessage = undefined;
        req.session.decryptedData = undefined;
        res.send(html);
    });
});






//renders the create contact page
router.get("/new", (req, res) => {
    let message = req.session.message; // if there is a message in the session object then it will be outputted to the user
    let errorMessage = req.session.errorMessage;

    let businessName = req.session.businessName;
    let firstName = req.session.firstName;
    let lastName = req.session.lastName;
    let email = req.session.email;
    let telephone = req.session.telephone;
    let city = req.session.city;
    let postcode = req.session.postcode;
    let address = req.session.address;


    let valuesStoredInSessionFromBody = [businessName, firstName, lastName, email, telephone, city, postcode, address];

    res.render("CreateContact",
        {
            flashMessage: message,
            savedBodyValue: valuesStoredInSessionFromBody,
            errorMessage: errorMessage

        },
        function (err, html) {

        // sets all the session properties to undefined after the page has been rendered so that they don't
        // get rendered into other pages that they shouldn't be in
            req.session.message = undefined;
            req.session.errorMessage = undefined;

            req.session.businessName = undefined;
            req.session.firstName = undefined;
            req.session.lastName = undefined;
            req.session.email = undefined;
            req.session.telephone = undefined;
            req.session.city = undefined;
            req.session.postcode = undefined;
            req.session.address = undefined;

            res.send(html);
    });

});





//renders the edit contact page Requires an id in the url to know which contact to look up
router.get("/edit:id", (req, res) => {
    let contactsFile = new CSVHandler(__dirname + '/dataStoreFiles/contacts.csv');

    // req.params.id to get contact id from the url
    let id = req.params.id; // gets the contacts id from the url
    let contactsRecord = contactsFile.selectRecordByID(id);
    let message = req.session.message;

    // handles the case where no contact with that Id was found in the files
    // returns a basic html page with a link to go back to the contacts show page
    if (contactsRecord.length === 0) {
        res.send('<h1>Error 404: Contact Not Found</h1><br><<a href="/contacts">Go Back</a>');
    }
    else {
        // ACCESS ANY RECORD ELEMENT VIA .record and then [element index]
        res.render("EditContact", {contact: contactsRecord[0], flashMessage: message}, (err, html) => {
            req.session.message = undefined;
            res.send(html);
        });
    }
});





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//                                      POST ROUTES

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////






// post route to add a record to the contacts page

router.post("/", (req, res) => {
    let contactsFile = new CSVHandler(__dirname + '/dataStoreFiles/contacts.csv');

    // stores the values from the text fields into variables
    // the some of the values get capitalized to aid the data maintainability
    let businessName = StringUtility.capitalizeString(req.body.businessName);
    let firstName =  StringUtility.capitalizeString(req.body.firstName);
    let lastName =  StringUtility.capitalizeString(req.body.lastName);
    let email =  req.body.email;
    let telephone = req.body.telephone;
    let city =  StringUtility.capitalizeString(req.body.city);
    let postcode = req.body.postcode;
    let address =  StringUtility.capitalizeString(req.body.address);
    let status = req.body.status;

    // do validation here

    let Validation = new ContactsValidation(businessName,firstName, lastName, email, telephone, city, postcode, address, status);
    let validationResult = Validation.checkFieldsAreValid(); // this will either store the boolean value true or a message of what needs to be fixed

    if (validationResult === true) {
        // if it passes validation, add record and redirect to contacts list page
        contactsFile.addRecord([businessName, firstName, lastName, email, telephone, city, postcode, address, status]);
        req.session.message = "Successfuly Created A Contact";
        res.redirect("/contacts/");
    }

    else {
        // if something does not pass the validation then the user will get redirected to the
        // create contacts page and a req.session.message will get set to the validationResult output
        // this can then be accessed at the /contacts/new route to notify the user where they went wrong

        req.session.message = validationResult; // validation message

        // there will also be other properties attached to the session memory property containing the entered form data
        // so that the fields don't go blank if any of the user's inputs did not pass the validation
        req.session.businessName = businessName;
        req.session.firstName = firstName;
        req.session.lastName = lastName;
        req.session.email = email;
        req.session.telephone = telephone;
        req.session.city = city;
        req.session.postcode = postcode;
        req.session.address = address;


        res.redirect("/contacts/new")

    }

});





//renders the contacts list page that outputs any contacts that match the search value
router.post("/search", (req, res) => {
    let contactsFile = new CSVHandler(__dirname + '/dataStoreFiles/contacts.csv');

    let searchValue = req.body.searchBar; // gets the search value from the form

    // finds all matches of the search value by looking in every column for one
    let matchingRecords = contactsFile.getRecordsOnlyByField([0,1,2,3,4,5,6,7,8,9,10], searchValue);


    // if there is no match then do the search again but with the search value capitalized
    if (matchingRecords.length === 0){
        searchValue = StringUtility.capitalizeString(searchValue);
        matchingRecords =  contactsFile.getRecordsOnlyByField([0,1,2,3,4,5,6,7,8,9,10], searchValue);

        // if there is still no match, the user gets redirected to the contacts list page with all the contacts
        if (matchingRecords.length === 0) {
            req.session.errorMessage = "No Matches found";
            res.redirect("/contacts/")
        } else {

            res.render("ContactsList", {
                contactRecords: matchingRecords,
                titleAddition: "Searched for: " + searchValue,
                flashMessage : matchingRecords.length.toString() + " Matches Found",
                errorMessage: undefined
            });
        }
    } else {
        res.render("ContactsList", {
            contactRecords: matchingRecords,
            titleAddition: "Searched for: " + searchValue,
            flashMessage : matchingRecords.length.toString() + " Matches Found",
            errorMessage: undefined
        });
    }

});





router.post("/sortBy", (req, res) => {
    let contactsFile = new CSVHandler(__dirname + '/dataStoreFiles/contacts.csv');
    let sortByValue = req.body.sortBy; // will return undefined if no value is selected
    let ascOrDec = req.body.order; // will be either ascending or descending
    let sortedArray = [];

    // turns the names gotten back from the sort form into the index that the records will need to be sorted by
    switch (sortByValue) {
        case "date":
            sortByValue = {index: 1, label: "Date"}; // date is stored at index 1 in the contacts csv file
            break;
        case "city":
            sortByValue = {index: 7, label: "City"}; // city is stored at index 7 in the contacts csv file
            break;
        case "businessName":
            sortByValue = {index: 2, label: "Business Name"}; // business name is at index 2 in the contacts csv file
            break;
        default:
            // if undefined is returned because there is no value selected in the form
            // then the sortByValue will be set to the value 3 which is the index of the first name
            sortByValue = {index: 3, label: "First Name"};
    }

    // turns the ascending/ descending option into a boolean value which can be used by the sortBy method
    switch (ascOrDec) {
        case "ascending":
            ascOrDec = true;
            break;
        case "descending":
            ascOrDec = false;
            break;
        default:
            ascOrDec = false;
    }

    // sort the array by the sortByValue in ascending or descending order dependent on the ascOrDec boolean argument that
    // gets passed in. the sorted array gets stored into the sortedArray variable
    sortedArray = contactsFile.sortBy(sortByValue.index, ascOrDec);

    res.render("ContactsList",
        {
            contactRecords: sortedArray,
            titleAddition: "Sorted By: " + sortByValue.label,
            flashMessage: undefined,
            errorMessage: undefined

        });

});






// this route is used to add a note to the contactNotes file
router.post("/addnote:id", (req, res) => {
    let contactsNotes = new CSVHandler(__dirname + '/dataStoreFiles/contactsNotes.csv');

    let contactId = req.params.id; // gets the contacts id from the url
    let note = req.body.addNote; // gets the data in the text area and stores it
    // gets the current date and then converts it into dd/mm/yyyy format
    let date = DateHandler.standardDateTo_Date_DDMMYYYY(DateHandler.getCurrentDateTime());


    // do validation on the note
    let validation = new AddNoteValidation(note);
    let validationValue = validation.checkFieldsAreValid();

    if (validationValue === true) { // if it passes the validation then add the record
        // add note to the file as:  noteId, dateTimeStamp, contactId, note
        contactsNotes.addRecord([date, contactId, note]);
        req.session.message = "Successfully Added A Note";
        res.redirect("/contacts/viewContact" + contactId);
    }

    else {
        // if the data does not pass the validation the user will get sent back to the same page with a
        // message telling where they went wrong
        req.session.errorMessage = validationValue;
        res.redirect("/contacts/viewContact" + contactId);
    }



});





// will take the user to the password page so that the user can enter a password to encrypt or decrypt the
// Extra Notes text area data

router.post("/viewContact:id/encryptNotes_:encOrDec", (req, res) => {
    let id = req.params.id; // get id from the url
    let encryptOrDecrypt = req.params.encOrDec; // stores if the user wants to encrypt or decrypt the data
    let message = req.session.message;

    if (req.body.extraNotes !== undefined) {
        req.session.extraNotesData = req.body.extraNotes; // get the extra notes data from the text area and store in the session memory
    }

    res.render("EncryptNotes", {contactId: id, encryptOrDecrypt: encryptOrDecrypt, flashMessage: message});
});



// preform encryption on the data and append a new record to the database if there is no record containing the contact's id
// if a record is found with the users id then the record will be edited to contain the new encrypted data
router.post("/viewContact:id/encrypt", (req, res) => {

    let id = req.params.id;
    let extraNotesFile = new CSVHandler(__dirname + '/dataStoreFiles/contactsExtraNotes.csv');


    // does password validation and gets either true or a string value returned
    let passwordValidation = new PasswordValidation(req.body.password, req.body.confirmPassword);
    let validationResult = passwordValidation.checkFieldsAreValid();
    let encryptedData;
    let extraNotesRecord;

    // do password validation, if it passes validation then continue
    if (validationResult === true) {

        let extraNotesData = req.session.extraNotesData; // stores the extraNotesData from the session memory
        req.session.extraNotesData = undefined; // removes the property from the session memory

        // encrypt data with the password

        encryptedData = Encryption.xorEncrypt(extraNotesData, req.body.password);

        // look for a record with an id of the contacts
        // id found ==> edit the data to store the encrypted data
        // id not found ==> add record : [id, timestamp, contact id, data]

        // search for a match for the contacts id in the contactsExtraNotes file

        extraNotesRecord = extraNotesFile.getRecordsOnlyByField([2], id);
        if(extraNotesRecord.length === 0){ // if no match is found
            extraNotesFile.addRecord([id, encryptedData]); // add record
            req.session.message = "Successfully Encrypted Data";
            res.redirect("/contacts/viewContact" + id);
        }

        // match is found
        else {
            // edit the data in that record
            extraNotesFile.editRecord(extraNotesRecord[0][0], [["3", encryptedData]]);
            req.session.message = "Successfully Changed The Encrypted Data";
            res.redirect("/contacts/viewContact" + id);
        }


    }

    else {
        // if not, redirect to the /contacts/viewContact:id/encryptNotes_encrypt
        // with a message of what went wrong
        req.session.message = validationResult;
        // redirects to the post route /viewContact:id/encrypt
        res.redirect(307, "/contacts/viewContact" + id + "/encryptNotes_encrypt");
    }







});




// preform decryption on the data stored in req.session.extraNotesData
// if req.session.extraNotesData === undefined then redirect to the individual contacts page
router.post("/viewContact:id/decrypt", (req, res) => {
    // do password validation, if it passes validation then continue
    // if not, redirect to the /contacts/viewContact:id/encryptNotes_decrypt
    // with a message of what went wrong

    let id = req.params.id;
    let extraNotesFile = new CSVHandler(__dirname + '/dataStoreFiles/contactsExtraNotes.csv');


    // does password validation and gets either true or a string value returned
    let passwordValidation = new PasswordValidation(req.body.password, req.body.confirmPassword);
    let validationResult = passwordValidation.checkFieldsAreValid();
    let extraNotesRecord;
    let encryptedData;
    let decryptedData;

    // do password validation, if it passes validation then continue
    if (validationResult === true) {

        // decrypt data with the password


        // look for a record with an id of the contacts
        // id found ==> edit the data to store the encrypted data
        // id not found ==> add record : [id, timestamp, contact id, data]

        // search for a match for the contacts id in the contactsExtraNotes file
        extraNotesRecord = extraNotesFile.getRecordsOnlyByField([2], id)[0];

        if(extraNotesRecord.length === 0){ // if no match is found
            req.session.errorMessage = "No Data To Decrypt";
            res.redirect("/contacts/viewContact" + id);
        }

        // match is found
        else {
            // decrypt the encrypted data and put that into session memory
            encryptedData = extraNotesRecord[3];
            decryptedData = Encryption.xorDecrypt(encryptedData, req.body.password);
            req.session.message = "Successfully Decrypted The Data";
            req.session.decryptedData = decryptedData;
            res.redirect("/contacts/viewContact" + id);
        }


    }

    else {
        // if not, redirect to the /contacts/viewContact:id/encryptNotes_encrypt
        // with a message of what went wrong
        req.session.message = validationResult;
        // redirects to the post route /viewContact:id/encrypt
        res.redirect(307, "/contacts/viewContact" + id + "/encryptNotes_decrypt");
    }



});









//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//                                      PUT ROUTES

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////




// route for updating files containing data
router.put("/:id", (req, res) => {
    let contactsFile = new CSVHandler(__dirname + '/dataStoreFiles/contacts.csv');
    let record = req.body; // stores the data from the edit contact form in an object
    let recordArray = Object.values(record); // turns the record object into an array

    let arrayOfEdits = [];

    // populate an array of changes to be made
    for (let i = 0; i < recordArray.length; i++) {
        // capitalizes the values stored in the array at the bellow index's
        if (i === 0 || i === 1 || i === 2 || i === 5 || i === 7 ) {
            recordArray[i] = StringUtility.capitalizeString(recordArray[i]);
        }
        // puts the data into the format needed for the edit record method to work
        let recordChange = [(i+2).toString(), recordArray[i]];
        arrayOfEdits.push(recordChange);
    }

    // do validation here

    let Validation = new ContactsValidation(record.businessName, record.firstName, record.lastName,
        record.email, record.telephone, record.city, record.postcode, record.address, record.status);

    let validationResult = Validation.checkFieldsAreValid(); // this will either store the boolean value true or a message of what needs to be fixed

    if (validationResult === true) {
        // update all fields in the record that has been updated
        contactsFile.editRecord(req.params.id, arrayOfEdits);
        req.session.message = "Contact Successfully Edited";
        res.redirect("/contacts/"); // takes user back to the contact list page
    }

    else {
        // if something does not pass the validation then the user will get redirected to the
        // create contacts page and a req.session.message will get set to the validationResult output
        // this can then be accessed at the /contacts/new route to notify the user where they went wrong

        req.session.message = validationResult; // validation message


        // if validation not met then a message gets generated and the user gets sent to the edit contact page
        // with that message stored in the session memory object

        res.redirect("/contacts/edit" + req.params.id); // takes user back to the contacts list page
    }
});




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//                                      DELETE ROUTES

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// delete route to remove a record
// when a contact is deleted, all of its notes and its extra notes records should also get deleted
router.delete("/delete:id", (req, res) => {
    let contactsFile = new CSVHandler(__dirname + '/dataStoreFiles/contacts.csv');
    let contactsExtraNotesFile = new CSVHandler(__dirname + '/dataStoreFiles/contactsExtraNotes.csv');
    let id = req.params.id; // gets the contacts id from the url
    let contactsExtraNoteRecord;

    let contactsNotesTempFileForDelete;

    contactsFile.deleteRecord(id); // deletes the contact record from the contacts.csv file

    // gets the record with the contacts id at index 2 Then returns a 2D array with the record in the only array
    // within the 2D array. record accessed with the [0] at the end
    contactsExtraNoteRecord = contactsExtraNotesFile.getRecordsOnlyByField([2], id)[0];
    contactsExtraNotesFile.deleteRecord(contactsExtraNoteRecord[0]); // the [0] gets the data at the 0 index which is the id

    res.redirect("/contacts/");
});



module.exports = router;