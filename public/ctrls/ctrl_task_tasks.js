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
        if ($rootScope.uid && $scope.currentBoard){
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
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            user.getToken().then(function(accessToken) {
                $rootScope.uid = user.uid;
                var parentRef = firebase.database().ref('users/' + $scope.uid);
                parentRef.off();
                parentRef.child('current').on('value', function(snapshot){
                    $rootScope.currentBoard = snapshot.val();
                    if ($rootScope.currentBoard == null)
                        $rootScope.$broadcast('NewUser');
                    else LoadTasks();
                });
            });
        } else console.log('Not logged in');
    }, function(error) {
        console.log(error);
    });

    var LoadTasks = function(){
        var ref = firebase.database().ref('tasks/'+$rootScope.currentBoard);
        ref.off();
        ref.on('value', function(snap){
            $.ajax({
                url: '/api/v1/task?uid='+$rootScope.uid+'&board='+$rootScope.currentBoard,
                type: 'GET',
                success: function(data){
                    addData(data);
                },
                error: function(error){
                    console.log(error);
                }
            });
        });
    };
    var addData = function(data){
        $scope.items = [[],[],[]];
        $.each(data, function(key, val){
            $scope.items[parseInt(val.stage)].push({
                key: key,
                title: val.title,
                desc: val.desc,
                due: DateDiff(parseInt(val.due)),
                label: val.label,
                file: val.file,
                name: val.name,
                direction: ((!val.file || val.file == 'No File') ? 'left' : 'bottom')
            });
            $scope.items[parseInt(val.stage)].sort(compFunc);
        });
        if (!$scope.$$phase) $scope.$apply();
    };
    var days = ['Sun','Mon','Tue','Wed','Thur','Fri','Sat'];
    var mos = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var DateDiff = function(due_date) {
        var date = new Date(due_date);
        return days[date.getDay()] + ', ' + date.getDate() + ' '
               + mos[date.getMonth()] + ' ' + date.getFullYear();
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

    /////////////////////////////
    // move or delete the task //
    /////////////////////////////
    $scope.MoveTask = function(key){
        $scope.key = key;
        if ($rootScope.uid){
            $.ajax({
                url: '/api/v1/task/'+$scope.key+'?uid='+$rootScope.uid+'&board='+$rootScope.currentBoard,
                type: 'GET',
                success: function(data){
                    taskMove(data);
                },
                error: function(error){
                    console.log(error);
                }
            });
        }
    };
    var taskMove = function(data){
        var stage = data.stage;
        if (stage < 2){
            stage = parseInt(stage) + 1;
            $.ajax({
                url: '/api/v1/task/'+$scope.key+'?uid='+$rootScope.uid+'&board='+$rootScope.currentBoard,
                type: 'POST',
                datatype: "application/json",
                data: {
                    stage: stage
                },
                success: function(data){
                    console.log(data);
                },
                error: function(error){
                    console.log(error);
                }
            });
        }
        else{
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this task?')
                .textContent('This cannot be undone.')
                .targetEvent(event)
                .ok('Yes')
                .cancel('No');
            $mdDialog.show(confirm).then(function() {
                $.ajax({
                    url: '/api/v1/task/'+$scope.key+'?uid='+$rootScope.uid+'&board='+$rootScope.currentBoard,
                    type: 'DELETE',
                    datatype: "application/json",
                    success: function(data){
                        console.log(data);
                    },
                    error: function(error){
                        console.log(error);
                    }
                });
            });
        }
    };

    ///////////////////////////////////////////////////////////
    // broadcast up to rootScope to pass to other controller //
    ///////////////////////////////////////////////////////////
    $scope.UpdateTask = function(key){
        $rootScope.$broadcast('UpdateData', {
            key: key
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
