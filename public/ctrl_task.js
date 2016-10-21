// Load, Move, Delete, Edit Tasks
angular.module('TaskApp').controller('TaskCtrl',
function($rootScope, $scope, $mdDialog){
	$scope.titles = ['Upcoming','In Progress','Done'];
	$scope.icons = ['forward','done','delete'];
	$scope.icon_names = ['Start','Done','Delete'];

	// load and refresh tasks
	firebase.auth().onAuthStateChanged(function(user){
		$scope.items = [[],[],[]];
		if(user) {
			var ref = firebase.database().ref(user.uid);
			ref.off();	// detach old listeners from previous sesions
			ref.on('child_added', function(snapshot){
				var val = snapshot.val();
				var item = {
					title: val.title,
					desc: val.desc,
					due: DateDiff(val.due),
					label: val.label,
					key: snapshot.key,
					date: val.due
				};
				$scope.items[val.stage].push(item);
				$scope.items[val.stage].sort(compFunc);
				$scope.$apply();
			});
			ref.on('child_changed', function(snapshot){
				var val = snapshot.val();
				var loc = val.stage;
				// normal update
				for (var i = 0; i < $scope.items[loc].length; i++){
					if ($scope.items[loc][i].key == snapshot.key){
						var item = {
							title: val.title,
							desc: val.desc,
							due: DateDiff(val.due),
							date: val.due,
							label: val.label,
							key: snapshot.key
						};
						$scope.items[loc][i] = item;
						$scope.items[loc].sort(compFunc);
						$scope.$apply();
						return;
					}
				}
				// move
				if (loc > 0){
					for (var i = 0; i < $scope.items[loc - 1].length; i++){
						if ($scope.items[loc - 1][i].key == snapshot.key){
							$scope.items[loc].push($scope.items[loc - 1][i]);
							$scope.items[loc - 1].splice(i, 1);
							$scope.items[loc].sort(compFunc);
							$scope.$apply();
							return;
						}
					}
				}
				// refresh (back to upcoming)
				else{ for (; loc < 3; loc++){
					for (var i = 0; i < $scope.items[loc].length; i++){
						if ($scope.items[loc][i].key == snapshot.key){
							$scope.items[0].push($scope.items[loc][i]);
							$scope.items[loc].splice(i, 1);
							$scope.items[0].sort(compFunc);
							$scope.$apply();
							return;
						}
					}
				}}
			});
		}
	});

	// for sorting
	$scope.sortType = 'date';
	$scope.$on('ChangeSort', function(event, data){
		$scope.sortType = data.type;
		for (var i = 0; i < 3; i++)
			$scope.items[i].sort(compFunc);
		$scope.$apply();
	});
	function compFunc(a, b){
		if ($scope.sortType == 'label' && a.label != b.label){
			var l = ["Red","Orange","Yellow","Green","Blue","Purple","None"];
			return l.indexOf(a.label) - l.indexOf(b.label);
		}
		return a.date - b.date;
	}

	var DateDiff = function(due_date) {
		var days = ['Sun','Mon','Tue','Wed','Thur','Fri','Sat'];
		var mos = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var date = new Date(due_date);
		return days[date.getDay()] + ', ' + date.getDate() + ' '
		+ mos[date.getMonth()] + ' ' + date.getFullYear();
	};

	// move or delete the task
	$scope.MoveTask = function(event, key, val){
		var user = firebase.auth().currentUser;
		if (user){
			var ref = firebase.database().ref(user.uid).child(key);
			if (val < 2) ref.update({ stage: val + 1 });
			else DeleteTask(event, ref, key);
		}
	};
	var DeleteTask = function(event, ref, key){
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

	// broadcast up to rootscope to pass to other controller
	$scope.UpdateTask = function(event, key, title, label, date, desc){
		$mdDialog.show({
			contentElement: '#update_task',
			parent: angular.element(document.body),
			targetEvent: event,
			clickOutsideToClose: true,
			fullscreen: true
		});
		$rootScope.$broadcast('UpdateData', {
			key: key,
			title: title,
			date: date,
			label: label,
			desc: desc
		});
	};

	// add padding to bottom of last column
	$scope.addClass = function(col){
		if (col == 2)
			return 'pad';
		return null;
	};
});
