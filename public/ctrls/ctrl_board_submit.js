angular.module('TaskApp').controller('SubmitBoardCtrl',
function($scope, $mdDialog, $mdToast){
	$scope.$on('NewUser', function(){
		$scope.newUser = true;
		$scope.title = "Hello ";
		$scope.desc = 'Welcome to Tasqer!';
		$scope.submit();
	});
	$scope.submit = function(){
		if ($scope.code){
			var user = firebase.auth().currentUser;
			if (user){
				var ref = firebase.database().ref('boards');
				ref.once('value', function(snapshot){
					var val = snapshot.val();
					var count = 0;
					// check if board exists
					Object.keys(val).forEach(function(key){
						if (key == $scope.code){
							addUser(user, key);
							return;
						}
						count++;
					});
					if (count == Object.keys(val).length){
						$mdToast.show(
							$mdToast.simple()
							.textContent('That board doesn\'t exist.')
							.position('bottom left')
							.hideDelay(3000)
						);
					}
				});
			}
		}
		else if (!$scope.title || !$scope.desc)
			$scope.error = true;
		else{
			var user = firebase.auth().currentUser;
			if (user){
				if ($scope.newUser){
					$scope.title += user.displayName;
					$scope.newUser = false;
				}
				console.log($scope.title);
				var key = firebase.database().ref('boards').push({
					title: $scope.title,
					desc: $scope.desc
				}).key;
				addUser(user, key);
			}
		}
	};
	function addUser(user, key){
		var ref = firebase.database().ref('users/' + user.uid);
		ref.once('value', function(snap){
			var v = snap.val();
			if (v){
				var val = v.boards;
				var count = 0;
				// check if user already a member
				Object.keys(val).forEach(function(k){
					if (val[k] == key){
						$mdToast.show(
							$mdToast.simple()
							.textContent('You are already a member of that board.')
							.position('bottom left')
							.hideDelay(3000)
						);
						return;
					}
					count++;
				});
				if (count == Object.keys(val).length)
					pushUser(user, key, ref);
			}
			else pushUser(user, key, ref);
		});
	}

	function pushUser(user, key, ref){
		ref.child('boards').push(key);
		ref.update({ current: key });
		firebase.database().ref('boards/' + key + '/users').push(user.uid);
		$mdDialog.hide();
	}

	// reopen board list
	$scope.cancel = function(){
		$scope.title = null;
		$scope.desc = null;
		$scope.code = null;
		$mdDialog.show({
			contentElement: '#list_board',
			parent: angular.element(document.body),
			clickOutsideToClose: true
		});
	};
});
