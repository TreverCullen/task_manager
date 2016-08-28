var config = {
	apiKey: "AIzaSyDL7_8sVdnD0OcMtR0_tBMykVt_256u5Xc",
	authDomain: "task-1a6cf.firebaseapp.com",
	databaseURL: "https://task-1a6cf.firebaseio.com",
	storageBucket: "",
};
firebase.initializeApp(config);

window.onload = function(){
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			console.log("Logged In");
		} else {
			console.log("Not Logged In");
		}
	});
};
