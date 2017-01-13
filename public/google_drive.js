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
	gapi.load('auth');
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
	// createPicker();
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
	else if (!oauthToken){
		console.log('invalid auth token');
		onAuthApiLoad();
	}
	else{
		console.log('somehow we got here');
	}
}

// A simple callback implementation.
function pickerCallback(data) {
	var url = 'No File';
	var name = 'No File';
	if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
		var doc = data[google.picker.Response.DOCUMENTS][0];
		url = doc[google.picker.Document.URL];
		name = doc[google.picker.Document.NAME];
	}
	// pass url back to controllers
	angular.element(document.getElementById('create')).scope().googleDrive(url, name);
	angular.element(document.getElementById('update')).scope().googleDrive(url, name);
}
