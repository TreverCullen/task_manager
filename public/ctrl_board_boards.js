// Load, Move, Delete, Edit Tasks
angular.module('TaskApp').controller('BoardCtrl',
function($scope, $mdDialog){

	$scope.BoardDialog = function(event) {
		$mdDialog.hide();
		$mdDialog.show({
			contentElement: '#create_board',
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose: true,
			fullscreen: true
		});
	};

	// create board
	firebase.auth().onAuthStateChanged(function(user){
		$scope.items = [];
		if(user) {
			var ref = firebase.database().ref('users/' + user.uid).child('boards');
			ref.off();	// detach old listeners from previous sesions
			ref.on('child_added', function(snapshot){
				var val = snapshot.val();
				var childref = firebase.database().ref('boards/' + val.reference);
				childref.once('value', function(childsnap){
					var val = childsnap.val();
					$scope.items.push({
						title: val.title,
						desc: val.desc,
						created: val.created,
						key: childsnap.key
					});
					$scope.items.sort(compFunc);
				});
			});
		}
	});

	$scope.selectBoard = function(id){
		var user = firebase.auth().currentUser;
		if (user){
			firebase.database().ref('users/' + user.uid).update({
				current: id
			});
		}
		$scope.cancel();
	};

	function compFunc(a, b){
		return a.title - b.title;
	}

	$scope.cancel = function(){
		$mdDialog.hide();
	};
});
