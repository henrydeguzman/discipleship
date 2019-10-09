/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 07/10/2019
 * Time: 9:27 PM
 */
victory
    .controller('purplebook.ctrl.diags.markasdone',[function(){}])
    .controller('purple_book.ctrl.diags.adddates',['$scope','Notification','centralFctry','tableService','notifValues','$filter','genvarsValue',function($scope,Notification,centralFctry,tableService,notifValues,$filter,genvarsValue){
    var vm=this;
    $scope.curdate=$filter('date')(genvarsValue.curdate,genvarsValue.dateformat);
    vm.date={format:'MMM-dd-yyyy'};
    vm.date.save=function(){
        var notif=Notification(notifValues['processing']({message:"Adding..."},$scope)),
            posted=centralFctry.postData({ url:'fetch/purplebook_set/setdate',data:{purplebook_date:vm.date.value} });
        if(posted.$$state!==undefined){
            return posted.then(function(v){
                if(v.data.success){
                    tableService.refresh('purplebook.dates');
                    Notification(notifValues['added']($scope));
                    $scope.$parent.close(v.data);
                } else{
                    vm.date.validation={"purplebook_date":"required"};
                    notif.then(function(v){ v.kill(true); });
                }
            });
        }
    };
}]);