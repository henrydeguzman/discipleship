/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 11/09/2019
 * Time: 11:45 PM
 */
victory.controller('dashboard.page.controller',['$scope','genvarsValue',function($scope,genvarsValue){
    var vm=this;
    $scope.baseyear=2019;$scope._dates=[];
    for(var x=genvarsValue.curyear;x>=$scope.baseyear;x--){
        $scope._dates.push(x);
    }
    console.log($scope._dates);
}]);