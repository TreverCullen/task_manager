angular.module('TaskApp').controller('BoardCtrl',
function($scope, $mdDialog, $rootScope){

	//////////////////
	// create board //
	//////////////////
	$scope.BoardDialog = function() {
		$mdDialog.show({
			contentElement: '#create_board',
			parent: angular.element(document.body),
			clickOutsideToClose: true
		});
	};

	///////////////////////
	// edit board dialog //
	///////////////////////
	$scope.EditBoardDialog = function(title, desc, key) {
		$rootScope.$broadcast('UpdateBoard', {
			key: key,
			title: title,
			desc: desc
		});
	};

	//////////////////
	// create board //
	//////////////////
	firebase.auth().onAuthStateChanged(function(user){
		if (user) {
			var ref = firebase.database().ref('users/' + user.uid).child('boards');
			ref.off();	// detach old listeners from previous sesions
			ref.on('value', function(snapshot){
				$scope.boards = [];
				var val = snapshot.val();
				if (val != null){
					Object.keys(val).forEach(function(key) {
						$scope.boards.push(val[key]);
					});
				}
			});
		}
	});

	////////////////
	// board list //
	////////////////
	$scope.$watch('boards', function(){
		$scope.items = [];
		if ($scope.boards){
			Object.keys($scope.boards).forEach(function(key) {
				boardListener(key);
			});
		}
	});
	function boardListener(key){
		var ref = firebase.database().ref('boards/' + $scope.boards[key]);
		ref.off();
		ref.on('value', function(snapshot){
			var val = snapshot.val();
			if (val){
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
			}
		});
	}

	//////////////////
	// change board //
	//////////////////
	$scope.selectBoard = function(id){
		var user = firebase.auth().currentUser;
		if (user){
			firebase.database().ref('users/' + user.uid).update({
				current: id
			});
		}
		$scope.cancel();
	};

	/////////////////
	// sort boards //
	/////////////////
	function compFunc(a, b){
		return a.title - b.title;
	}

	///////////////////////
	// hide board dialog //
	///////////////////////
	$scope.cancel = function(){
		$mdDialog.hide();
	};
});
