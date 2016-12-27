// Submit task
angular.module('TaskApp').controller('SubmitTaskCtrl',
function($scope, $mdDialog){
	$scope.labels = ["None","Red","Orange","Yellow","Green","Blue","Purple"];

	///////////////////
	// menu listener //
	///////////////////
	$scope.$on('CreateTask', function(event, data){
		$mdDialog.show({
			contentElement: '#create_task',
			parent: angular.element(document.body),
			clickOutsideToClose: true,
			onShowing: function (event, removePromise) {
				$scope.file = 'No File';
				$scope.name = 'No File';
			}
		});
	});

	//////////////////////////
	// add task to database //
	//////////////////////////
	$scope.submit = function(){
		var data = {
			title: $scope.title,
			desc: $scope.desc,
			date: $scope.date,
			label: $scope.label,
			file: $scope.file,
			name: $scope.name
		}
		if (!data.title || !data.desc || !data.date || !data.label)
			$scope.error = true;
		else{
			var user = firebase.auth().currentUser;
			if (user){
				var ref = firebase.database().ref('users/' + user.uid);
				ref.once('value', function(snapshot){
					callBack(snapshot.val().current);
				});
			}
			$scope.cancel();
		}
		function callBack(board){
			if (board){
				firebase.database().ref('tasks/' + board).push({
					title: data.title,
					due: data.date.getTime(),
					desc: data.desc,
					label: data.label,
					file: data.file,
					name: data.name,
					stage: 0
				});
			}
		};
	};

	///////////////////////////
	// add google drive file //
	///////////////////////////
	$scope.googleDrive = function(url, name){
		$scope.file = url;
		$scope.name = name;
	};

	//////////////////////////////
	// remove google drive file //
	//////////////////////////////
	$scope.removeFile = function(){
		$scope.file = 'No File';
		$scope.name = 'No File';
	};

	////////////////////////////////
	// cancel task and clear form //
	////////////////////////////////
	$scope.cancel = function(){
		$mdDialog.hide();
		$scope.title = null;
		$scope.desc = null;
		$scope.date = null;
		$scope.label = null;
		$scope.error = false;
		$scope.file = 'No File';
		$scope.name = 'No File';
	};
});
