/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 11/09/2019
 * Time: 11:45 PM
 */
victory.controller('dashboard.page.controller',['$scope','genvarsValue','centralFctry',function($scope,genvarsValue,centralFctry){
    var vm=this;

    vm.list={};
    getdata();
    function getdata(){
        var posted=centralFctry.getData({url:'fetch/dashboard_get/getlist',data:{churchid:genvarsValue.userdata('churchid')}});
        if(posted.$$state!==undefined){
            posted.then(function(v){
                vm.list.data=v.data[0];
            });
        }
    }
}]);