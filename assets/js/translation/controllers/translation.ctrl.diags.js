/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 05/10/2019
 * Time: 11:13 AM
 */
victory.controller('translation.ctrl.diags.frm',['$scope','searchEngine',function($scope,searchEngine){
    var vm=this;
    $scope.form={};
    vm.search={isloading:false};
    vm.search.code=function(){
        vm.search.isloading=true;
        searchEngine.search('fetch/translation_cloud/searchlist',{
            data:{sample:'12344'},
            onSuccess:function(v){

                vm.search.isloading=false;
            }
        });
    };
}]);