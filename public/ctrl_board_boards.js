// Load, Move, Delete, Edit Tasks
angular.module('TaskApp').controller('BoardCtrl',
function($scope, $mdDialog, $rootScope){

	$scope.BoardDialog = function(event) {
		$mdDialog.show({
			contentElement: '#create_board',
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose: true
		});
	};
	$scope.EditBoardDialog = function(event, title, desc, key) {
		$rootScope.$broadcast('UpdateBoard', {
			key: key,
			title: title,
			desc: desc
		});
		$mdDialog.show({
			contentElement: '#edit_board',
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose: true
		});
	};

	// create board
	firebase.auth().onAuthStateChanged(function(user){
		if (user) {
			var ref = firebase.database().ref('users/' + user.uid).child('boards');
			ref.off();	// detach old listeners from previous sesions
			ref.on('value', function(snapshot){
				$scope.boards = [];
				var val = snapshot.val();
				Object.keys(val).forEach(function(key) {
					$scope.boards.push(val[key].reference);
				});
			});
		}
	});


	// listeners on boards
	$scope.$watch('boards', function(){
		$scope.items = [];
		if ($scope.boards){
			Object.keys($scope.boards).forEach(function(key) {
				var ref = firebase.database().ref('boards/' + $scope.boards[key]);
				ref.once('value', function(snapshot){
					var val = snapshot.val();
					var item = {
						title: val.title,
						desc: val.desc,
						key: snapshot.key
					};
					if ($scope.items.length == 0)
						$scope.items.push(item);
					for (var i = 0; i < $scope.items.length; i++){
						if ($scope.items[i].key == item.key){
							$scope.items[i] = item;
							break;
						}
						else if (i == $scope.items.length - 1)
							$scope.items.push(item);
					}
				});
			});
		}
	});

	$scope.selectBoard = function(id){
		var user = firebase.auth().currentUser;
		if (user){
			firebase.database().ref('users/' + user.uid).update({
				current: id
			});
		}
		$scope.cancel();
	};

	function compFunc(a, b){
		return a.title - b.title;
	}

	$scope.cancel = function(){
		$mdDialog.hide();
	};
});
