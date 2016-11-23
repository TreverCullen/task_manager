// menu options including logout, add task
angular.module('TaskApp').controller('MenuCtrl',
function($rootScope, $scope, $mdDialog, $mdMedia) {
	$scope.isOpen = false;
	$scope.icon = 'menu';
	$scope.sortType = 'label';

	$scope.Logout = function() {
		firebase.auth().signOut().then(function() {
			location.pathname = "/login";
		}, function(error) {
			alert(error.message);
		});
	};
	$scope.TaskDialog = function(event) {
		if ($scope.isOpen){
			$mdDialog.show({
				contentElement: '#create_task',
				parent: angular.element(document.body),
				targetEvent: event,
				clickOutsideToClose: true
			});
		}
	};
	$scope.ListBoardDialog = function(event) {
		if ($scope.isOpen){
			$mdDialog.show({
				contentElement: '#list_board',
				parent: angular.element(document.body),
				targetEvent: event,
				clickOutsideToClose: true
			});
		}
	};
	$scope.Enter = function(){
		if (!$mdMedia('xs'))
			$scope.isOpen = true;
		$scope.icon = 'create';
	};
	$scope.Leave = function(){
		if (!$mdMedia('xs'))
			$scope.isOpen = false;
		$scope.icon = 'menu';
	};
	$scope.Sort = function(){
		$rootScope.$broadcast('ChangeSort', {
			type: $scope.sortType
		});
		if ($scope.sortType == 'date')
			$scope.sortType = 'label';
		else $scope.sortType = 'date';
		$scope.Leave();
	};
});
