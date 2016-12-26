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
	$scope.googleDrive = function(){

		// The Browser API key obtained from the Google Developers Console.
		var developerKey = 'AIzaSyDL7_8sVdnD0OcMtR0_tBMykVt_256u5Xc';
		// The Client ID obtained from the Google Developers Console. Replace with your own Client ID.
		var clientId = "533681754473-o4oubuhhro4h2mafjr4ok1370596j490.apps.googleusercontent.com";
		// Scope to use to access user's photos.
		var scope = ['https://www.googleapis.com/auth/drive.readonly'];
		var pickerApiLoaded = false;
		var oauthToken;

		// Use the API Loader script to load google.picker and gapi.auth.
		function onApiLoad() {
			gapi.load('auth', {'callback': onAuthApiLoad});
			gapi.load('picker', {'callback': onPickerApiLoad});
		}

		function onAuthApiLoad() {
			window.gapi.auth.authorize(
			{
				'client_id': clientId,
				'scope': scope,
				'immediate': false
			},
			handleAuthResult);
		}

		function onPickerApiLoad() {
			pickerApiLoaded = true;
			createPicker();
		}

		function handleAuthResult(authResult) {
			if (authResult && !authResult.error) {
				oauthToken = authResult.access_token;
				createPicker();
			}
		}

		function createPicker() {
			if (pickerApiLoaded && oauthToken) {
				var view = new google.picker.DocsView()
					.setParent('root')
					.setIncludeFolders(true);
				var picker = new google.picker.PickerBuilder()
					.addView(view)
					.enableFeature(google.picker.Feature.NAV_HIDDEN)
            		// .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
					.setOAuthToken(oauthToken)
					.setDeveloperKey(developerKey)
					.setCallback(pickerCallback)
					.build();
				picker.setVisible(true);
			}
		}

		// A simple callback implementation.
		function pickerCallback(data) {
			var url = 'nothing';
			if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
				var doc = data[google.picker.Response.DOCUMENTS][0];
				url = doc[google.picker.Document.URL];
			}
			if (url != 'nothing'){
				$scope.file = url;
				$scope.$apply();
			}
		}

		onApiLoad();
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
