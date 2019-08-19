/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 19/08/2019
 * Time: 2:02 PM
 */
angular.module('MainDiagController',[])
.controller('appmaindiag.diagtype.confirm',['$scope',function($scope){
    var vm=this;
    vm.submit=function(bool){
        console.log($scope.data);
        if(bool&&$scope.data!==undefined&&typeof($scope.data.fn)==='function'){
            $scope.data.fn();
        }
        $scope.$parent.close();
    };
}]);