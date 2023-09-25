const CronJob = require("node-cron");
const axios = require("axios");
const { sendEmail } = require("./sendEmail");
// const cronExpression = "*/5 * * * * *"; // Run every 5 seconds
const cronExpression = "*/5 * * * *"; // Run every 5 minutes

exports.initScheduledJobs = () => {
  console.log("Initializing Run");
  sendEmail("StartUp Schedule Running", "iPhone Check is running...");
  const scheduledJobFunction = CronJob.schedule(cronExpression, () => {
    axios
      .get(
        "https://reserve-prime.apple.com/AU/en_AU/reserve/A/availability.json"
      )
      .then(({ data }) => {
        try {
          const iphoneInCanberra = data?.stores?.R483;
          const iphone15InCanberra = iphoneInCanberra["MU793ZP/A"];
          const isIphoneAvailable = iphone15InCanberra?.availability?.unlocked;
          console.log("Checking if iPhone is available", isIphoneAvailable);
          if (isIphoneAvailable) {
            console.log("iPhone is now available. Sending Email...");
            sendEmail();
          }
        } catch (e) {
          console.log(e);
        }
      })
      .error((e) => console.log(e));
  });

  scheduledJobFunction.start();
};
