/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 19/08/2019
 * Time: 1:19 PM
 */
victory.controller('victoryweekend.ctrl.diags.createaccnts',['$scope',function($scope){
    var vm=this;
    vm.done=function(){
        $scope.$parent.close();
    }
}]);