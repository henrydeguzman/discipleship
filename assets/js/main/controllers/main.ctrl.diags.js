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

        if(bool&&$scope.data!==undefined&&typeof($scope.data.fn)==='function'){
            $scope.data.fn();
        } else {
             if($scope.data!==undefined&&typeof($scope.data.fncancel)==='function'){
                  $scope.data.fncancel();    
             }     
        }
        $scope.$parent.close();
    };
}]).controller('appmaindiag.diagtype.notify',['$scope',function($scope){
    var vm=this;
    vm.submit=function(){
        $scope.$parent.close();
        if($scope.data!==undefined&&typeof($scope.data.fn)==='function'){
            $scope.data.fn();
        }
    };
}]);