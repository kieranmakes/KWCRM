const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("Home");
});


router.get("/settings", (req, res) => {
    res.render("Settings");
});

router.get("/termsAndConditions", (req, res) => {
    res.render("TermsAndConditions");
});



module.exports = router;