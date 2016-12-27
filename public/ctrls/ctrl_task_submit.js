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
			file: $scope.file
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
					stage: 0
				});
			}
		};
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

	////////////////////////////////
	// cancel task and clear form //
	////////////////////////////////
	$scope.cancel = function(){
		console.log("cancel");
		$mdDialog.hide();
		$scope.title = null;
		$scope.desc = null;
		$scope.date = null;
		$scope.label = null;
		$scope.error = false;
		$scope.file = 'No File';
	};
});
