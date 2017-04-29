var developerKey = 'AIzaSyBCu_11dba2kgITHe9XVLgvmp83F9f18sw';
var clientId = '412850969025-eqfot8952hnqat2rafvgj3pda1nhk5rg.apps.googleusercontent.com';
var appId = '412850969025';
var scope = ['https://www.googleapis.com/auth/drive.readonly'];

var pickerApiLoaded = false;
var oauthToken = null;

function setToken(token){
	oauthToken = token;
}

// Use the API Loader script to load google.picker and gapi.auth.
function onApiLoad() {
	gapi.load('auth');
	gapi.load('picker', {'callback': function(){ pickerApiLoaded = true; }});
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

function handleAuthResult(authResult) {
	if (authResult && !authResult.error) {
		oauthToken = authResult.access_token;
		createPicker();
	}
}

function createPicker() {
	onAuthApiLoad();
	if (pickerApiLoaded && oauthToken) {
		var view = new google.picker.DocsView()
			.setParent('root')
			.setIncludeFolders(true);
		var picker = new google.picker.PickerBuilder()
			.addView(view)
			.enableFeature(google.picker.Feature.NAV_HIDDEN)
			// .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
			.setAppId(appId)
			.setOAuthToken(oauthToken)
			.setDeveloperKey(developerKey)
			.setCallback(pickerCallback)
			.build();
		picker.setVisible(true);
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
