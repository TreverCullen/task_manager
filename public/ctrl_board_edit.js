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
				$mdDialog.show({
					contentElement: '#list_board',
					parent: angular.element(document.body),
					targetEvent: event,
					clickOutsideToClose: true
				});
			}
		}
	};
	// cancel task and clear form
	$scope.cancel = function(){
		$mdDialog.hide();
		$scope.title = null;
		$scope.desc = null;
	};

	$scope.DeleteBoard = function(){
		$mdToast.show(
			$mdToast.simple()
			.textContent('Not Available')
			.position('bottom left')
			.hideDelay(3000)
		);
	};
});
