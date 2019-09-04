const express = require("express");
const app = express();
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const session = require('express-session');

//requiring routes
const
    indexRoutes = require("./routes/index"),
    analyticsRoutes = require("./routes/analyticsRoutes"),
    dashboardRoutes = require("./routes/dashboardRoutes"),
    contactsRoutes = require("./routes/contactsRoutes");




// so that I can pass data between the backend and front end without just xhr requests
// .urlencoded({extended: true}) allows me to pass nested objects to the front end and from the front end to the server
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); //sets my view engine to the ejs templating language which will allow me to use js in the mark up
app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));  // express middleware to serve the static files such as css and js to the client using the express HTTP framework
app.use(methodOverride("_method")); // methodOverride will allow me to use more http verbs than html5 forms support
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false})); // will allow me to store data to the session property

// setting my express http framework to use these url routes as the route paths for each
// of the different types of routes to aid readability with  RESTFUL ROUTES for each of the routes
// the routes that extend from their base
app.use("/", indexRoutes);
app.use("/contacts", contactsRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/dashboard", dashboardRoutes);

app.listen(process.env.PORT || 8000, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("server started on port 8000");
    }
});







