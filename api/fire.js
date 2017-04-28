var admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert(
      './tasqer-153422-firebase-adminsdk-5g814-8b036a1799.json'
    ),
    databaseURL: "https://tasqer-153422.firebaseio.com"
});

var db = admin.database();
module.exports = {
    db: db
};
