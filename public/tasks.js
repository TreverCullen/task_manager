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
		})
		// menu options including logout, add task
		.controller('MenuCtrl', function($scope, $mdDialog) {
			$scope.isOpen = false;
			$scope.icon = 'menu';
			$scope.Logout = function() {
				firebase.auth().signOut().then(function() {
					location.pathname = "/login";
				}, function(error) {
					alert(error.message);
				});
			};
			$scope.TaskDialog = function(event) {
				$mdDialog.show({
					contentElement: '#create_task',
					parent: angular.element(document.body),
					targetEvent: event,
					clickOutsideToClose: true
				});
			};
		})

		// Submit task
		.controller('SubmitTaskCtrl', function($scope, $mdDialog){
			$scope.date = new Date();
			$scope.submit = function(){
				if ($scope.title != null && $scope.desc != null){
					var user = firebase.auth().currentUser;
					if (user){
						firebase.database().ref(user.uid).push({
							title: $scope.title,
							due: $scope.date.toString(),
							desc: $scope.desc,
							stage: 0
						});
					}
					$scope.cancel();
				}
			};
			// cancel task and clear form
			$scope.cancel = function(){
				$mdDialog.hide();
				$scope.title = "";
				$scope.date = "";
				$scope.desc = "";
			};
		})

		// Load, Move, Delete, Edit Tasks
		.controller('TaskCtrl', function($rootScope, $scope, $mdDialog){
			console.log("Loading Tasks");
			$scope.titles = ['Upcoming','In Progress','Done'];
			$scope.icons = ['forward','done','delete'];
			$scope.icon_names = ['Start','Done','Delete'];
			$scope.items = [[],[],[]];

			firebase.auth().onAuthStateChanged(function(user){
				if (user){
					var ref = firebase.database().ref(user.uid);
					ref.on('child_added', function(snapshot){
						var val = snapshot.val();
						var item = {
							title: val.title,
							desc: val.desc,
							due: DateDiff(val.due),
							key: snapshot.key,
							date: val.due
						};
						$scope.items[val.stage].push(item);
					});
					ref.on('child_changed', function(snapshot){
						var loc = snapshot.val().stage;
						// normal update
						for (var i = 0; i < $scope.items[loc].length; i++){
							if ($scope.items[loc][i].key == snapshot.key){
								var val = snapshot.val();
								var item = {
									title: val.title,
									desc: val.desc,
									due: DateDiff(val.due),
									key: snapshot.key,
									date: val.due
								};
								$scope.items[loc][i] = item;
								return;
							}
						}
						// move
						for (var i = 0; i < $scope.items[loc - 1].length; i++){
							if ($scope.items[loc - 1][i].key == snapshot.key){
								$scope.items[loc].push($scope.items[loc - 1][i]);
								$scope.items[loc - 1].splice(i, 1);
								return;
							}
						}
					});
				}
			});
			function DateDiff(due_date) {
				var days = ['Sun','Mon','Tues','Wed','Thurs','Fri','Sat'];
				var mos = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
				var date = new Date(due_date);
				return days[date.getDay()] + ', ' + mos[date.getMonth()] + ' ' + date.getDate();
			}
			$scope.MoveTask = function(event, key, val){
				firebase.auth().onAuthStateChanged(function(user){
					if (user){
						var ref = firebase.database().ref(user.uid).child(key);
						if (val < 2) ref.update({ stage: val + 1 });	
						else DeleteTask(event, ref, key);
					}
				});
			};
			function DeleteTask(event, ref, key){
				var confirm = $mdDialog.confirm()
					.title('Are you sure you want to delete this task?')
					.textContent('This cannot be undone.')
					.targetEvent(event)
					.ok('Yes')
					.cancel('No');
				$mdDialog.show(confirm).then(function() {
					ref.set(null);
					for (var i = 0; i < $scope.items[2].length; i++){
						if ($scope.items[2][i].key == key){
							$scope.items[2].splice(i, 1);
							break;
						}
					}
					console.log('Task ' + key + ' has been deleted');
				});
			};
			$scope.UpdateTask = function(event, key, title, date, desc){
				$mdDialog.show({
					contentElement: '#update_task',
					parent: angular.element(document.body),
					targetEvent: event,
					clickOutsideToClose: true
				});
				$rootScope.$broadcast('UpdateData', {
					key: key,
					title: title,
					date: date,
					desc: desc
				});
			};
		})

		.controller('UpdateTaskCtrl', function($scope, $mdDialog){
			$scope.$on('UpdateData', function(event, data){
				$scope.title = data.title;
				$scope.date = new Date(data.date);
				$scope.desc = data.desc;
				$scope.key = data.key
			});
			$scope.submit = function(){
				firebase.auth().onAuthStateChanged(function(user){
					if (user){
						var ref = firebase.database().ref(user.uid).child($scope.key);
						ref.update({
							title: $scope.title,
							due: $scope.date,
							desc: $scope.desc
						});
						$scope.cancel();
					}
				});
			};
			$scope.cancel = function(){
				$mdDialog.hide();
				$scope.title = "";
				$scope.date = new Date();
				$scope.desc = "";
			};
		});
})();