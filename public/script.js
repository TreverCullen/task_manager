var config = {
	apiKey: "AIzaSyDL7_8sVdnD0OcMtR0_tBMykVt_256u5Xc",
	authDomain: "task-1a6cf.firebaseapp.com",
	databaseURL: "https://task-1a6cf.firebaseio.com",
	storageBucket: "",
};
firebase.initializeApp(config);

window.onload = function(){

	// redirect for auth
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

	// snap horizontal scroll
	var current = $('.mobile_container').scrollLeft();
	$('.mobile_container').scroll(function(e){

		clearTimeout($.data(this, 'scrollTimer'));
	    $.data(this, 'scrollTimer', setTimeout(function() {

			var width = $(window).width();

			var elt = $('.mobile_container');
			var pos = elt.scrollLeft();

			if (pos < current)
				current = Math.floor(pos / width) * width;
			else current = Math.ceil(pos / width) * width;

			elt.stop().clearQueue().animate({scrollLeft: current}, 200, "linear");
			current = pos;

	    }, 100));
	});
};
