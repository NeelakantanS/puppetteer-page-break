const express = require("express");
const printReportController = require("../controller/print-report-controller")

const router = express.Router();


router.get("/", function (req, res, next) {
    res.send("index", { title: "Hello World" });
});

router.get("/print-report", printReportController.printReport);

module.exports = router;
