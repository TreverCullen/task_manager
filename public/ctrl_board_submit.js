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
					desc: $scope.desc,
					created: new Date()
				}).key;
				var ref = firebase.database().ref('users/' + user.uid);
				ref.child('boards').push({ reference: key });
				ref.update({ current: key });
			}
			$scope.cancel();
		}
	};
	// cancel task and clear form
	$scope.cancel = function(){
		$mdDialog.hide();
		$scope.title = null;
		$scope.desc = null;
	};
});
