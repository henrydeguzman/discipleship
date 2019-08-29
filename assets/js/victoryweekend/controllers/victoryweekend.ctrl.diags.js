/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 19/08/2019
 * Time: 1:19 PM
 */
victory.controller('victoryweekend.ctrl.diags.createaccnts',['$scope',function($scope){
    var vm=this;
}]).controller('victoryweekend.ctrl.diags.email',['$scope','centralFctry',function($scope,centralFctry){
    var vm=this;
    $scope.form={savetype:''};
    if($scope.data!==undefined&&$scope.data.tr.id!==undefined){ $scope.form.id=$scope.data.tr.id; }
    vm.submit=function(){
        console.log($scope.form);
        var posted=centralFctry.postData({
            url:'fetch/users_set/edit',data:$scope.form
        });
        if(posted.$$state!==undefined){
            posted.then(function(v){
                console.log(v.data);
                if(v.data.success){
                    $scope.$parent.close(v.data);
                }
            });
        }
    };
    console.log($scope.data);
}]);