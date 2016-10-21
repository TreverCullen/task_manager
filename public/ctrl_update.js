angular.module('TaskApp').controller('UpdateTaskCtrl',
function($scope, $mdDialog){
	$scope.$on('UpdateData', function(event, data){
		$scope.title = data.title;
		$scope.label = data.label;
		$scope.date = new Date(data.date);
		$scope.desc = data.desc;
		$scope.key = data.key;
	});
	$scope.labels = ["None","Red","Orange","Yellow","Green","Blue","Purple"];

	$scope.submit = function(){
		if (!$scope.title || !$scope.desc
			|| !$scope.date || !$scope.label)
			$scope.error = true;
		else{
			var user = firebase.auth().currentUser;
			if (user){
				var ref = firebase.database().ref(user.uid).child($scope.key);
				ref.update({
					title: $scope.title,
					label: $scope.label,
					due: $scope.date.getTime(),
					desc: $scope.desc
				});
				$scope.cancel();
			}
		}
	};
	$scope.cancel = function(){
		$mdDialog.hide();
		$scope.title = null;
		$scope.desc = null;
		$scope.date = null;
		$scope.label = null;
		$scope.error = null;
	};
	$scope.RefreshTask = function(){
		var user = firebase.auth().currentUser;
		if (user){
			var ref = firebase.database().ref(user.uid).child($scope.key);
			ref.update({ stage: 0 });
			$scope.cancel();
		}
	};
});
