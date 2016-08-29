var config = {
	apiKey: "AIzaSyDL7_8sVdnD0OcMtR0_tBMykVt_256u5Xc",
	authDomain: "task-1a6cf.firebaseapp.com",
	databaseURL: "https://task-1a6cf.firebaseio.com",
	storageBucket: "",
};
firebase.initializeApp(config);

window.onload = function(){
	firebase.auth().onAuthStateChanged(function(user) {
		if (user && location.pathname == "/login") {
			location.pathname = "/tasks";
			console.log("Logged In");
		}
		else if (!user && location.pathname == "/tasks") {
			location.pathname = "/login";
			console.log("Not Logged In");
		}
	});
};
