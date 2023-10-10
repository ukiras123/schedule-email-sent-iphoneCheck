const CronJob = require("node-cron");
const axios = require("axios");
const { sendEmail } = require("./sendEmail");
const cronExpression = "*/5 * * * * *"; // Run every 5 seconds
// const cronExpression = "*/5 * * * *"; // Run every 5 minutes

let nidoSearchConfig = {
  method: "post",
  url: "https://nido.edu.au/job-filter/",
  headers: {
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
  },
  data: "category=&location=1661862&worktype=&gettitle=&sub_cat_id=",
};
let config = (msg = "Hello") => {
  return {
    method: "post",
    url: `https://api.pushover.net/1/messages.json?token=ao9axyomrbd52ubdtxogndpg5rfb74&user=uxjq1hmrnszj9ey8tiv27ydrm92dpa&message=${msg}`,
  };
};

let apiResponse;
exports.initScheduledJobs = () => {
  console.log("Initializing Nido Search Run");
  sendEmail("StartUp Schedule Running", "Nido Job Check is running...");
  axios
    .request(config("Initial Setup"))
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });

  const scheduledJobFunction = CronJob.schedule(cronExpression, () => {
    axios
      .request(nidoSearchConfig)
      .then(({ data }) => {
        try {
          apiResponse = data;
          const isJobAvailable = !data.includes(
            "There is currently nothing available"
          );
          console.log("Job is Available", isJobAvailable);
          if (isJobAvailable) {
            console.log("Job is available in Nido. Sending Email...");
            sendEmail(
              "Nido Job Available",
              "Nido job is currently available, please apply online",
              "ukiras@gmail.com,aojaswi@gmail.com"
            );
            axios
              .request(config("Nido Job Available"))
              .then((response) => {
                console.log(JSON.stringify(response.data));
              })
              .catch((error) => {
                console.log(error);
              });
          }
        } catch (e) {
          console.log(e);
          console.log("Nido Search Response was ->", apiResponse);
        }
      })
      .error((e) => console.log(e));
  });

  scheduledJobFunction.start();
};
