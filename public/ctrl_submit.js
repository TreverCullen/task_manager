// Submit task
angular.module('TaskApp').controller('SubmitTaskCtrl',
function($scope, $mdDialog){
	$scope.labels = ["None","Red","Orange","Yellow","Green","Blue","Purple"];
	$scope.submit = function(){
		if (!$scope.title || !$scope.desc
			|| !$scope.date || !$scope.label)
			$scope.error = true;
		else{
			var user = firebase.auth().currentUser;
			if (user){
				firebase.database().ref(user.uid).push({
					title: $scope.title,
					due: $scope.date.getTime(),
					desc: $scope.desc,
					label: $scope.label,
					stage: 0
				});
			}
			$scope.cancel();
		}
	};
	// cancel task and clear form
	$scope.cancel = function(){
		$mdDialog.hide();
		$scope.title = null;
		$scope.desc = null;
		$scope.date = null;
		$scope.label = null;
		$scope.error = false;
	};
});
