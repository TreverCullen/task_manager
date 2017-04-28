var config = {
    apiKey: "AIzaSyBCu_11dba2kgITHe9XVLgvmp83F9f18sw",
    authDomain: "tasqer-153422.firebaseapp.com",
    databaseURL: "https://tasqer-153422.firebaseio.com",
    storageBucket: "tasqer-153422.appspot.com",
    messagingSenderId: "412850969025"
};
firebase.initializeApp(config);

// var initApp = function() {
//     firebase.auth().onAuthStateChanged(function(user) {
//         if (user) {
//             user.getToken().then(function(accessToken) {
//                 uid = user.uid;
//                 token = accessToken;
//             });
//         } else {
//             // location.pathname = '/login';
//         }
//     }, function(error) {
//         console.log(error);
//     });
// };
// window.addEventListener('load', function() {
//     initApp();
//     // scroll();
// });

// var scroll = function(){
//     // snap horizontal scroll
// 	var current = $('.mobile_container').scrollLeft();
// 	$('.mobile_container').scroll(function(e){
//
// 		clearTimeout($.data(this, 'scrollTimer'));
// 	    $.data(this, 'scrollTimer', setTimeout(function() {
//
// 			var width = $(window).width();
//
// 			var elt = $('.mobile_container');
// 			var pos = elt.scrollLeft();
//
// 			if (pos < current)
// 				current = Math.floor(pos / width) * width;
// 			else current = Math.ceil(pos / width) * width;
//
// 			elt.stop().clearQueue().animate({scrollLeft: current}, 200, "linear");
// 			current = pos;
//
// 	    }, 100));
// 	});
// };
