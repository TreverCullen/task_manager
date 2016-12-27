angular.module('TaskApp').controller('UpdateTaskCtrl',
function($scope, $mdDialog){

	$scope.labels = ["None","Red","Orange","Yellow","Green","Blue","Purple"];

	////////////////////////////////
	// set scope to update dialog //
	////////////////////////////////
	$scope.$on('UpdateData', function(event, data){
		$scope.title = data.title;
		$scope.label = data.label;
		$scope.date = new Date(data.date);
		$scope.desc = data.desc;
		$scope.key = data.key;
		$scope.file = data.file;
		$mdDialog.show({
			contentElement: '#update_task',
			parent: angular.element(document.body),
			clickOutsideToClose: true
		});
	});

	/////////////////
	// update task //
	/////////////////
	$scope.submit = function(){
		if (!$scope.title || !$scope.desc || !$scope.date || !$scope.label)
			$scope.error = true;
		else{
			var user = firebase.auth().currentUser;
			if (user){
				var parentRef = firebase.database().ref('users/' + user.uid);
				parentRef.once('value', function(snap){
					var board = snap.val().current;
					var ref = firebase.database().ref('tasks/' + board).child($scope.key);
					ref.update({
						title: $scope.title,
						label: $scope.label,
						due: $scope.date.getTime(),
						desc: $scope.desc,
						file: $scope.file
					});
					$scope.cancel();
				});
			}
		}
	};

	///////////////////////////
	// add google drive file //
	///////////////////////////
	$scope.googleDrive = function(url){
		$scope.file = url;
	};

	//////////////////////////////
	// remove google drive file //
	//////////////////////////////
	$scope.removeFile = function(){
		$scope.file = 'No File';
	};

	////////////////////////
	// clear update board //
	////////////////////////
	$scope.cancel = function(){
		$mdDialog.hide();
		$scope.title = null;
		$scope.desc = null;
		$scope.date = null;
		$scope.label = null;
		$scope.error = null;
		$scope.file = 'No File';
	};

	///////////////////////////
	// send task to upcoming //
	///////////////////////////
	$scope.RefreshTask = function(){
		var user = firebase.auth().currentUser;
		if (user){
			var parentRef = firebase.database().ref('users/' + user.uid);
			parentRef.once('value', function(snap){
				var board = snap.val().current;
				var ref = firebase.database().ref('tasks/' + board).child($scope.key);
				ref.update({ stage: 0 });
				$scope.cancel();
			});
		}
	};
});
