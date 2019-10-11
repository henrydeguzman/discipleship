/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 11/10/2019
 * Time: 9:43 PM
 */
victory
    .controller('empleaders.ctrl.diags.markasdone',[function(){}])
    .controller('empleaders.ctrl.diags.adddates',['$scope','Notification','centralFctry','tableService','notifValues','$filter','genvarsValue',function($scope,Notification,centralFctry,tableService,notifValues,$filter,genvarsValue){
        var vm=this;
        $scope.curdate=$filter('date')(genvarsValue.curdate,genvarsValue.dateformat);
        vm.date={format:'MMM-dd-yyyy'};
        vm.date.save=function(){
            var notif=Notification(notifValues['processing']({message:"Adding..."},$scope)),
                posted=centralFctry.postData({ url:'fetch/empleaders_set/setdate',data:{empleaders_date:vm.date.value} });
            if(posted.$$state!==undefined){
                return posted.then(function(v){
                    if(v.data.success){
                        tableService.refresh('empleaders.dates');
                        Notification(notifValues['added']($scope));
                        $scope.$parent.close(v.data);
                    } else{
                        vm.date.validation={"empleaders_date":"required"};
                        notif.then(function(v){ v.kill(true); });
                    }
                });
            }
        };
    }]);