angular.module('TaskApp').controller('UpdateTaskCtrl',
function($rootScope, $scope, $mdDialog){

    $scope.labels = ["None","Red","Orange","Yellow","Green","Blue","Purple"];

    ////////////////////////////////
    // set scope to update dialog //
    ////////////////////////////////
    $scope.$on('UpdateData', function(event, data){
        $scope.key = data.key;
        $.ajax({
            url: '/api/v1/task/'+$scope.key+'?uid='+$rootScope.uid+'&board='+$rootScope.currentBoard,
            type: 'GET',
            success: function(data){
                setData(data);
            },
            error: function(error){
                console.log(error);
            }
        });
    });
    var setData = function(data){
        $scope.title = data.title;
        $scope.desc = data.desc;
        $scope.date = new Date(parseInt(data.due));
        $scope.label = data.label;
        $scope.file = data.file;
        $scope.name = data.name;
        $mdDialog.show({
            contentElement: '#update_task',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    };

    /////////////////
    // update task //
    /////////////////
	$scope.submit = function(){
        if (!$scope.title || !$scope.desc || !$scope.date || !$scope.label)
            $scope.error = true;
        else{
            var data = {
                title: $scope.title,
                desc: $scope.desc,
                due: $scope.date.getTime(),
                label: $scope.label,
                file: $scope.file,
                name: $scope.name
            };
            $.ajax({
                url: '/api/v1/task/'+$scope.key+'?uid='+$rootScope.uid+'&board='+$rootScope.currentBoard,
                type: 'POST',
                datatype: "application/json",
                data: data,
                success: function(data){
                    $scope.cancel();
                },
                error: function(error){
                    console.log(error);
                }
            });
        }
	};

	///////////////////////////
	// add google drive file //
	///////////////////////////
	$scope.googleDrive = function(url, name){
		$scope.file = url;
		$scope.name = name;
	};

	//////////////////////////////
	// remove google drive file //
	//////////////////////////////
	$scope.removeFile = function(){
		$scope.file = 'No File';
		$scope.name = 'No File';
	};

	////////////////////////
	// clear update board //
	////////////////////////
    $scope.cancel = function(){
        $mdDialog.hide();
    };

	///////////////////////////
	// send task to upcoming //
	///////////////////////////
	$scope.RefreshTask = function(){
        $.ajax({
            url: '/api/v1/task/'+$scope.key+'?uid='+$rootScope.uid+'&board='+$rootScope.currentBoard,
            type: 'POST',
            datatype: "application/json",
            data: {
                stage: 0
            },
            success: function(data){
                $scope.cancel();
            },
            error: function(error){
                console.log(error);
            }
        });
	};
});
