// menu options including logout, add task
angular.module('TaskApp').controller('MenuCtrl',
function($rootScope, $scope, $mdDialog, $mdMedia) {
	$scope.isOpen = false;
	$scope.icon = 'menu';
	$scope.sortType = 'label';

	////////////
	// logout //
	////////////
	$scope.Logout = function() {
		firebase.auth().signOut().then(function() {
			location.pathname = "/login";
		}, function(error) {
			alert(error.message);
		});
	};

	//////////////
	// new task //
	//////////////
	$scope.TaskDialog = function() {
		if ($scope.isOpen)
			$rootScope.$broadcast('CreateTask');
	};

	/////////////////
	// list boards //
	/////////////////
	$scope.ListBoardDialog = function() {
		if ($scope.isOpen){
			$mdDialog.show({
				contentElement: '#list_board',
				parent: angular.element(document.body),
				clickOutsideToClose: true
			});
		}
	};

	////////////////
	// for mobile //
	////////////////
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

	//////////////////////
	// change task sort //
	//////////////////////
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
