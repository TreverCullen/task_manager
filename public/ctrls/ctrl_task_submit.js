// Submit task
angular.module('TaskApp').controller('SubmitTaskCtrl',
function($scope, $mdDialog){
	$scope.labels = ["None","Red","Orange","Yellow","Green","Blue","Purple"];

	//////////////////////////
	// add task to database //
	//////////////////////////
	$scope.submit = function(){
		var data = {
			title: $scope.title,
			desc: $scope.desc,
			date: $scope.date,
			label: $scope.label
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
					stage: 0
				});
			}
		};
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
	};
});
