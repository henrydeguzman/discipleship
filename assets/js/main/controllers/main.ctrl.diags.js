/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 19/08/2019
 * Time: 2:02 PM
 */
//$scope.asdf = { isloading:false };
angular.module('MainDiagController',[])
    .controller('appmaindiag.diagtype.process',['$scope','centralFctry','dialogs',function($scope,centralFctry,dialogs){
        $scope.processing=true; var collection = $scope.data; $scope.$parent.closeshow=false; process();
        function process(){
            var posted=centralFctry.postData({ url:collection.content.url, data:collection.content.data, serializer:'jqlike' });
            if(posted.$$state!==undefined){
                posted.then(function(v){ $scope.processing=false;
                    if(v.data.success){ if(collection.fn!==undefined&&typeof(collection.fn)==='function'){ collection.fn(v); } }
                    else{ dialogs.error(v.data.info,function(){ $scope.$parent.close(); }); }
                });
            }
        }
    }])
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