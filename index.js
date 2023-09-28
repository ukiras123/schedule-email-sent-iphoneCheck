const express = require("express");
require("dotenv").config();
// DEFINE the path to your scheduled function(s)
const scheduledFunctions = require("./scheduled");
const app = express();
app.set("port", process.env.PORT || 3000);

// ADD CALL to execute your function(s)
scheduledFunctions.initScheduledJobs();

app.get("/status", (req, res) => {
  console.log("Status Check...");
  res.send({ status: "healthy" });
});

app.get("/health", (req, res) => {
  res.send({ status: "healthy" });
});

app.listen(app.get("port"), () => {
  console.log("Express server listening on port " + app.get("port"));
});
