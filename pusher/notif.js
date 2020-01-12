const constants = require("./constants");
const PushNotifications = require("pusher-push-notifications-node");

const pushNotifications = new PushNotifications({
  instanceId: constants.instanceId,
  secretKey: constants.secretKey
});

module.exports.notify = (name, personId) => {
  pushNotifications.publish(
    [constants.interest],
    {
      fcm: {
        notification: {
          title: `${name} is at your door!`,
          body: "Open the app to view this person's details."
        },
        data: {
          personId
        }
      }
    }).then((publishResponse) => {
      console.log("Just published:", publishResponse.publishId);
    }).catch((error) => {
      console.log("Error:", error);
    });
  };