const express = require("express");
const router = express.Router();
const CSVHandler = require("../classes/CSVHandler");
const DateHandler = require("../classes/DateHandler");
const Analyticals = require("../classes/Analyticals");




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//                                      GET ROUTES

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


router.get("/", (req, res) => {
    res.redirect("/analytics/daily");
});


// route that will give graph data for the past 14 days
router.get("/daily", (req, res) => {

    let clientsGainedFile = new CSVHandler(__dirname + '/dataStoreFiles/clientsGained.csv');
    let clientsLostFile = new CSVHandler(__dirname + '/dataStoreFiles/clientsLost.csv');
    let leadsLostFile = new CSVHandler(__dirname + '/dataStoreFiles/leadsLost.csv');

    let analytics = new Analyticals(clientsGainedFile, clientsLostFile, leadsLostFile);

    // find the conversion rate for the month in ratio and percentage ==> put into the ejs file
    let conversionRateObj = analytics.GetConversionRateForTheMonth();
    
    // find the data points and labels for the past 14 days ==> put into the ejs file
    let dataPointsAndLabels = analytics.getDataPointsAndLabelsForThePast14Days(); // will store data points and labels for clients gained and lost in data points

    res.render("Analytics", {conversionRate: conversionRateObj, graphData: dataPointsAndLabels, timeScale: "daily"});
});





// route that will give graph data for the past 12 weeks
router.get("/weekly", (req, res) => {

    let clientsGainedFile = new CSVHandler(__dirname + '/dataStoreFiles/clientsGained.csv');
    let clientsLostFile = new CSVHandler(__dirname + '/dataStoreFiles/clientsLost.csv');
    let leadsLostFile = new CSVHandler(__dirname + '/dataStoreFiles/leadsLost.csv');

    let analytics = new Analyticals(clientsGainedFile, clientsLostFile, leadsLostFile);

    // find the conversion rate for the month in ratio and percentage ==> put into the ejs file
    let conversionRateObj = analytics.GetConversionRateForTheMonth();

    // find the data points and labels for the past 14 days ==> put into the ejs file
    let dataPointsAndLabels = analytics.getDataPointsAndLabelsForThePast12Weeks(); // will store data points and labels for clients gained and lost in data points



    res.render("Analytics", {conversionRate: conversionRateObj, graphData: dataPointsAndLabels, timeScale: "weekly"});
});




// route that will give graph data for the past 12 months
router.get("/monthly", (req, res) => {

    let clientsGainedFile = new CSVHandler(__dirname + '/dataStoreFiles/clientsGained.csv');
    let clientsLostFile = new CSVHandler(__dirname + '/dataStoreFiles/clientsLost.csv');
    let leadsLostFile = new CSVHandler(__dirname + '/dataStoreFiles/leadsLost.csv');

    let analytics = new Analyticals(clientsGainedFile, clientsLostFile, leadsLostFile);

    // find the conversion rate for the month in ratio and percentage ==> put into the ejs file
    let conversionRateObj = analytics.GetConversionRateForTheMonth();

    // find the data points and labels for the past 14 days ==> put into the ejs file
    let dataPointsAndLabels = analytics.getDataPointsAndLabelsForThePast12Months(); // will store data points and labels for clients gained and lost in data points



    res.render("Analytics", {conversionRate: conversionRateObj, graphData: dataPointsAndLabels, timeScale: "monthly"});
});





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//                                      POST ROUTES

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// route that will add a record to clients gained file
router.get("/clientGained", (req, res) => {
    let clientsGainedFile = new CSVHandler(__dirname + '/dataStoreFiles/clientsGained.csv');
    let monthAndYear = DateHandler.getCurrentDateTime();

    // makes the month and year ==> yyyy-mm and puts it back into a string
    monthAndYear = (monthAndYear.split(""));
    monthAndYear.splice(7,18);
    monthAndYear = monthAndYear.join("");
    

    clientsGainedFile.addRecord([monthAndYear], true, true);
    res.redirect("/analytics");
});



// route that will add a record to clients lost file
router.get("/clientLost", (req, res) => {
    let clientsLostFile = new CSVHandler(__dirname + '/dataStoreFiles/clientsLost.csv');
    let monthAndYear = DateHandler.getCurrentDateTime();
    // makes the month and year ==> yyyy-mm and puts it back into a string
    monthAndYear = (monthAndYear.split(""));
    monthAndYear.splice(7,18);
    monthAndYear = monthAndYear.join("");

    clientsLostFile.addRecord([monthAndYear], true, true);
    res.redirect("/analytics");
});



// route that will add a record to leads lost file
router.get("/leadLost", (req, res) => {
    let leadsLostFile = new CSVHandler(__dirname + '/dataStoreFiles/leadsLost.csv');
    let monthAndYear = DateHandler.getCurrentDateTime();
    // makes the month and year ==> yyyy-mm and puts it back into a string
    monthAndYear = (monthAndYear.split(""));
    monthAndYear.splice(7,18);
    monthAndYear = monthAndYear.join("");

    leadsLostFile.addRecord([monthAndYear], true, true);
    res.redirect("/analytics");
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//                                      DELETE ROUTES

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


router.delete("/removeAllData", (req, res) => {
    
    // delete records
    let leadsLostFile = new CSVHandler(__dirname + '/datastoreFiles/leadsLost.csv');
    let clientsLostFile = new CSVHandler(__dirname + '/datastoreFiles/clientsLost.csv');
    let clientsGainedFile = new CSVHandler(__dirname + '/datastoreFiles/clientsGained.csv');
   
    leadsLostFile.deleteAllRecords();
    clientsLostFile.deleteAllRecords();
    clientsGainedFile.deleteAllRecords();

    // redirect to the analytics page
    res.redirect("/analytics")

});

module.exports = router;
