angular.module('TaskApp').controller('SubmitBoardCtrl',
function($scope, $mdDialog, $mdToast){
	$scope.$on('NewUser', function(){
		$scope.title = 'First Board';
		$scope.desc = 'This is your first board.';
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
					Object.keys(val).forEach(function(key){
						if (key == $scope.code){
							addUser(user, key);
							return;
						}
						count++;
					});
					if (count == Object.keys(val).length){
						$mdDialog.hide();
						$mdToast.show(
							$mdToast.simple()
							.textContent('That board doesn\'t exist.')
							.position('bottom left')
							.hideDelay(3000)
					    );
						$mdDialog.show({
							contentElement: '#create_board',
							parent: angular.element(document.body),
							targetEvent: event,
							clickOutsideToClose: true
						});
					}
				});
			}
		}
		else if (!$scope.title || !$scope.desc)
			$scope.error = true;
		else{
			var user = firebase.auth().currentUser;
			if (user){
				var key = firebase.database().ref('boards').push({
					title: $scope.title,
					desc: $scope.desc
				}).key;
				addUser(user, key);
			}
		}
	};
	function addUser(user, key){
		firebase.database().ref('boards/' + key + '/users').push(user.uid);
		var ref = firebase.database().ref('users/' + user.uid);
		ref.child('boards').push({ reference: key });
		ref.update({ current: key });
		$mdDialog.hide();
	}

	// reopen board list
	$scope.cancel = function(){
		$mdDialog.show({
			contentElement: '#list_board',
			parent: angular.element(document.body)
		});
	};
});
