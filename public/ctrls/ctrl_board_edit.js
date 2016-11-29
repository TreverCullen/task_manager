angular.module('TaskApp').controller('EditBoardCtrl',
function($scope, $mdDialog, $mdToast){
	$scope.$on('UpdateBoard', function(event, data){
		$scope.title = data.title;
		$scope.desc = data.desc;
		$scope.key = data.key;
	});
	$scope.submit = function(key){
		if (!$scope.title || !$scope.desc)
			$scope.error = true;
		else{
			var user = firebase.auth().currentUser;
			if (user){
				firebase.database().ref('boards/' + $scope.key).update({
					title: $scope.title,
					desc: $scope.desc
				});
				$scope.cancel();
			}
		}
	};
	// reopen board list
	$scope.cancel = function(){
		$scope.title = null;
		$scope.desc = null;
		$scope.key = null;
		$mdDialog.show({
			contentElement: '#list_board',
			parent: angular.element(document.body),
			clickOutsideToClose: true
		});
	};

	/////////////////
	// SHARE BOARD //
	/////////////////
	$scope.ShareBoard = function(){
		$mdToast.show(
			$mdToast.simple()
			.textContent('Share Code: ' + $scope.key)
			.action('X')
			.position('bottom left')
			.hideDelay(10000)
		);
	};

	//////////////////
	// DELETE BOARD //
	//////////////////
	$scope.DeleteBoard = function(){
		var user = firebase.auth().currentUser;
		if (user){
			var ref = firebase.database().ref('users/' + user.uid);
			ref.once('value', function(snapshot){
				var val = snapshot.val().current;
				if ($scope.key == val){
					$mdToast.show(
						$mdToast.simple()
						.textContent('You can\'t delete your current board.')
						.position('bottom left')
						.hideDelay(3000)
					);
				}
				// else can delete board
				else DeleteBoardCallback(user);
			});
		}
	};
	function DeleteBoardCallback(user){
		var ref = firebase.database().ref('boards/' + $scope.key);
		ref.once('value', function(snapshot){
			var val = snapshot.val();
			var length = Object.keys(val.users).length;
			// last user
			if (length == 1){
				var confirm = $mdDialog.confirm()
					.title('Are you sure you want to delete this board?')
					.textContent('All associated tasks will also be deleted. \
					This cannot be undone.')
					.ok('Yes')
					.cancel('No');
				$mdDialog.show(confirm).then(function() {
					fullBoardDelete();
					removeFromUser(user);
					$mdToast.show(
						$mdToast.simple()
						.textContent('Deleted Board: ' + $scope.title)
						.position('bottom left')
						.hideDelay(3000)
					);
				});
			}
			// other members of this board
			else{
				var confirm = $mdDialog.confirm()
					.title('Are you sure you want to remove yourself from this board?')
					.textContent('Other members will still have access.')
					.ok('Yes')
					.cancel('No');
				$mdDialog.show(confirm).then(function() {
					removeFromUser(user);
					removeFromBoard(user, ref);
					$mdToast.show(
						$mdToast.simple()
						.textContent('Removed Board: ' + $scope.title)
						.position('bottom left')
						.hideDelay(3000)
					);
				});
			}
		});
	};
	function removeFromUser(user){
		var ref = firebase.database().ref('users/' + user.uid + '/boards');
		ref.once('value', function(snap){
			snap.forEach(function(snapshot){
				if ($scope.key == snapshot.val())
					ref.child(snapshot.key).remove();
			});
		});
	}
	function removeFromBoard(user){
		var ref = firebase.database().ref('boards/' + $scope.key + '/users');
		ref.once('value', function(snap){
			snap.forEach(function(snapshot){
				if (user.uid == snapshot.val())
					ref.child(snapshot.key).remove();
			});
		});
	}
	function fullBoardDelete(){
		firebase.database().ref('boards/' + $scope.key).set(null);
		firebase.database().ref('tasks/' + $scope.key).set(null);
	}
});
