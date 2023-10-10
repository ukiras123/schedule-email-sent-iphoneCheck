const CronJob = require("node-cron");
const axios = require("axios");
const { sendEmail } = require("./sendEmail");
// const cronExpression = "*/5 * * * * *"; // Run every 5 seconds
const cronExpression = "*/5 * * * *"; // Run every 5 minutes

let config = (msg = "Hello") => {
  return {
    method: "post",
    url: `https://api.pushover.net/1/messages.json?token=ao9axyomrbd52ubdtxogndpg5rfb74&user=uxjq1hmrnszj9ey8tiv27ydrm92dpa&message=${msg}`,
  };
};

let apiResponse;
exports.initScheduledJobs = () => {
  console.log("Initializing iPhone Availability Run");
  sendEmail("StartUp Schedule Running", "iPhone Check is running...");
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
      .get(
        "https://reserve-prime.apple.com/AU/en_AU/reserve/A/availability.json"
      )
      .then(({ data }) => {
        try {
          apiResponse = data;
          const iphoneInCanberra = data?.stores?.R483;
          const iphone15InCanberra = iphoneInCanberra["MU793ZP/A"];
          const isIphoneAvailable = iphone15InCanberra?.availability?.unlocked;
          console.log("Checking if iPhone is available", isIphoneAvailable);
          if (isIphoneAvailable) {
            console.log("iPhone is now available. Sending Email...");
            sendEmail();
            axios
              .request(config("iPhone is Available"))
              .then((response) => {
                console.log(JSON.stringify(response.data));
              })
              .catch((error) => {
                console.log(error);
              });
          }
        } catch (e) {
          console.log(e);
          console.log("iPhone Availability Response was ->", apiResponse);
        }
      })
      .error((e) => console.log(e));
  });

  scheduledJobFunction.start();
};
