angular.module('TaskApp').controller('SubmitBoardCtrl',
function($scope, $mdDialog){
	$scope.submit = function(){
		if (!$scope.title || !$scope.desc)
			$scope.error = true;
		else{
			var user = firebase.auth().currentUser;
			if (user){
				var key = firebase.database().ref('boards').push({
					title: $scope.title,
					desc: $scope.desc
				}).key;
				firebase.database().ref('boards/' + key + '/users').push(user.uid);
				var ref = firebase.database().ref('users/' + user.uid);
				ref.child('boards').push({ reference: key });
				ref.update({ current: key });
			}
			$mdDialog.hide();
		}
	};
	// reopen board list
	$scope.cancel = function(){
		$mdDialog.show({
			contentElement: '#list_board',
			parent: angular.element(document.body)
		});
	};
});
