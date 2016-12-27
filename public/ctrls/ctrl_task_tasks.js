// Load, Move, Delete, Edit Tasks
angular.module('TaskApp').controller('TaskCtrl',
function($rootScope, $scope, $mdDialog, $mdToast, $compile){
	$scope.titles = ['Upcoming','In Progress','Done'];
	$scope.icons = ['forward','done','delete'];
	$scope.icon_names = ['Start','Done','Delete'];
	$scope.currentBoard = null;

	////////////////////////
	// board notification //
	////////////////////////
	$scope.$watch('currentBoard', function(){
		var user = firebase.auth().currentUser;
		if (user && $scope.currentBoard){
			var ref = firebase.database().ref('boards/' + $scope.currentBoard);
			ref.once('value', function(snap){
				var title = snap.val().title;
				$mdToast.show(
					$mdToast.simple()
					.textContent('Current Board: ' + title)
					.position('bottom left')
					.hideDelay(3000)
			    );
			});
		}
	});

	////////////////////////////
	// load and refresh tasks //
	////////////////////////////
	firebase.auth().onAuthStateChanged(function(user){
		if (user) {
			var parentRef = firebase.database().ref('users/' + user.uid);
			parentRef.off();
			parentRef.child('current').on('value', function(snapshot){
				$scope.currentBoard = snapshot.val();
				if ($scope.currentBoard == null)
					$rootScope.$broadcast('NewUser');
				else LoadTasks();
			});
		}
	});

	function LoadTasks(){
		// need to do some check here if someone doesn't have any boards
		var ref = firebase.database().ref('tasks/' + $scope.currentBoard);
		ref.off();	// detach old listeners from previous sesions
		ref.on('value', function(snap){
			$scope.items = [[],[],[]];
			var val = snap.val();
			if (val){
				var len = Object.keys(val).length;
				var count = 0;
				Object.keys(val).forEach(function(key) {
					var data = val[key];
					$scope.items[data.stage].push({
						title: data.title,
						desc: data.desc,
						due: DateDiff(data.due),
						label: data.label,
						key: key,
						date: data.due,
						file: data.file,
						name: data.name,
						direction: ((!data.file || data.file == 'No File') ? 'left' : 'bottom')
					});
					$scope.items[data.stage].sort(compFunc);
					count++;
					if (count == len && !$scope.$$phase)
						$scope.$apply();
				});
			}
			else $scope.$apply();
		});
	};

	//////////////////
	// add markdown //
	//////////////////
	$scope.markdown = function(input, file){
		var temp = marked(input);
		temp = temp.replace(/<a/g,'<a ng-click="link($event); $event.stopPropagation();"');
		temp = temp.replace(/href/g,'data');
		return temp;
	};
	$scope.link = function(event){
		var win = window.open(event.currentTarget.attributes.data.value, '_blank');
		win.focus();
	};

	///////////////////////////////
	// tooltip direction if file //
	///////////////////////////////
	$scope.getDirection = function(file){
		console.log("here");
		if (!file || file == 'No File')
			return 'left';
		return 'bottom';
	};

	/////////////////
	// for sorting //
	/////////////////
	$scope.sortType = 'date';
	$scope.$on('ChangeSort', function(event, data){
		$scope.sortType = data.type;
		for (var i = 0; i < 3; i++)
			$scope.items[i].sort(compFunc);
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

	/////////////////////////////
	// move or delete the task //
	/////////////////////////////
	$scope.MoveTask = function(key, val){
		var user = firebase.auth().currentUser;
		if (user){
			var board = $scope.currentBoard;
			var ref = firebase.database().ref('tasks/' + board).child(key);
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

	///////////////////////////////////////////////////////////
	// broadcast up to rootscope to pass to other controller //
	///////////////////////////////////////////////////////////
	$scope.UpdateTask = function(key, title, label, date, desc, file, name){
		$rootScope.$broadcast('UpdateData', {
			key: key,
			title: title,
			date: date,
			label: label,
			desc: desc,
			file: file,
			name: name
		});
	};

	//////////////////////////////////////////
	// add padding to bottom of last column //
	//////////////////////////////////////////
	$scope.addClass = function(col){
		if (col == 2)
			return 'pad';
		return null;
	};
});

///////////////////////////////////////
// directive to compile dynamic html //
///////////////////////////////////////
angular.module('TaskApp').directive('dynamic', function ($compile) {
	return {
		restrict: 'A',
		replace: true,
		link: function (scope, ele, attrs) {
			scope.$watch(attrs.dynamic, function(html) {
				ele.html(html);
				$compile(ele.contents())(scope);
			});
		}
	};
});
