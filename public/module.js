(function(){
'use strict';
	angular.module('TaskApp', ['ngMaterial'])
		.config(function($mdIconProvider, $mdThemingProvider) {
			$mdIconProvider.fontSet('md', 'material-icons');
			$mdThemingProvider.theme('default')
				.primaryPalette('blue')
				.accentPalette('teal')
				.warnPalette('red')
				.backgroundPalette('grey');
		});
	})
();
