const express = require("express");
const router = express.Router();
const CSVHandler = require("../classes/CSVHandler");
const StringUtility = require('../utilityMethods/StringUtility');
const DateHandler = require('../classes/DateHandler');
const Sort = require('../classes/Sort');
const DashboardValidation = require('../classes/DashboardValidation');



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//                                      GET ROUTES

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////





// renders the Dashboard page that has a form to add a scheduling and outputs the
// current days scheduled tasks and any future scheduled tasks

router.get("/", (req, res) => {
    let scheduleFile = new CSVHandler(__dirname + '/dataStoreFiles/scheduled.csv');
    let tasksWithCurrentDate = []; // will store a 2D array of all the tasks that that match the current Date
    let tasksWithFutureDate = [];
    let idsOfTasksWithPastDates = [];
    let timeStampOfTask = "";
    let date = "";
    let time = "";
    let message  = req.session.message;
    let errorMessage = req.session.errorMessage;

    // get all scheduled tasks
    let allScheduledTasks = scheduleFile.getAllRecords();
    let currentDateTime = DateHandler.getCurrentDateTime(); // gets the current date and time in a timestamp



    // determine which tasks have today's date
    allScheduledTasks.forEach((scheduledTaskRecord) => {


        timeStampOfTask = scheduledTaskRecord[2]; // will store the date time stamp in this element

        if (DateHandler.isToday(timeStampOfTask)) { // checks to see if the date of the task is equal to today's date
            tasksWithCurrentDate.push(scheduledTaskRecord);
        }
        else {
            // determine which tasks have a future date
            if (timeStampOfTask > currentDateTime) {
                tasksWithFutureDate.push(scheduledTaskRecord);
            }
            else {
                // determine which tasks that have a date that has passed
                if (timeStampOfTask < currentDateTime) {
                    idsOfTasksWithPastDates.push(scheduledTaskRecord[0]); // appends the schedule record's id to an past dates array
                }
            }
        }
    });

    // gets rid of a record that has a date passed every time the route gets called
    // this is done to help manage the data stored in the scheduled.csv file
    // deleting multiple records every time can cause errors if the file doesn't have enough time to complete
    // the method but this time is variable and could take too long so one is deleted at a time instead
    if (idsOfTasksWithPastDates.length > 0) {
        scheduleFile.deleteRecord(idsOfTasksWithPastDates[0]);
    }

    // sorts the tasks by their time stamps


    tasksWithCurrentDate = Sort.bubbleSort2D(tasksWithCurrentDate, 2, true);
    tasksWithFutureDate  = Sort.bubbleSort2D(tasksWithFutureDate, 2, true);


    res.render("Dashboard",
        {
            scheduledToday: tasksWithCurrentDate,
            scheduledFuture:tasksWithFutureDate,
            flashMessage: message,
            errorMessage: errorMessage
        },
        (err, html) => {
        req.session.message = undefined;
        req.session.errorMessage = undefined;
        res.send(html);
    });

});







//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//                                      POST ROUTES

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////






// post route to add a scheduled task
router.post("/", (req, res) => {
    let scheduleFile = new CSVHandler(__dirname + '/dataStoreFiles/scheduled.csv');

    let date = req.body.date;
    let time = req.body.time;
    let subject = StringUtility.capitalizeString(req.body.subject);
    let message = req.body.message;

    // do validation on the fields and if they pass then add record and redirect to dashboard

    let validation = new DashboardValidation(date, time, subject, message);
    let validationResult = validation.checkFieldsAreValid();

    if (validationResult === true) {

        // record will contain id, date created, date and time in standard date time format, date Of scheduling, time of the scheduling, subject, message
        scheduleFile.addRecord([DateHandler.createTimeStamp(date, time), date, time, subject, message]); // appends the record to the csv file
        req.session.message = "Successfully Added A Scheduled Task";
        res.redirect("/dashboard/")

    }

    // if they fail create a session message to say they have failed and redirect to dashboard
    else {
        req.session.errorMessage = validationResult; // validation result will have the details of what needs changing
        res.redirect("/dashboard/");
    }

});



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//                                      DELETE ROUTES

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//route to delete a schedule record
router.delete("/delete:id", (req, res) => {
    let scheduleFile = new CSVHandler(__dirname + '/dataStoreFiles/scheduled.csv');
    let id = req.params.id;
    scheduleFile.deleteRecord(id);
    req.session.message = "Successfully Deleted A Scheduled Task";
    res.redirect("/dashboard/");
});



module.exports = router;