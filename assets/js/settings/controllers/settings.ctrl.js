/**
 * Created by PhpStorm
 * User : Henrilics
 * Date : 2019-05-24
 * Time : 15:43
 */
victory.controller('settings.page.controller',['$scope','centralFctry','genvarsValue','$filter','tableService','Notification','notifValues',function($scope,centralFctry,genvarsValue,$filter,tableService,Notification,notifValues){
    var vm=this;
    getdataform();
    $scope.curdate=$filter('date')(genvarsValue.curdate,genvarsValue.dateformat);
    vm.weekend={date:{format:'MMM-dd-yyyy'},validation:{}};
    vm.weekend.date.save=function(){
        var notif=Notification(notifValues['processing']({message:"Adding..."},$scope)),
            posted=centralFctry.postData({ url:'fetch/weekend_set/setdate',data:{weekend_date:vm.weekend.date.value} });
        if(posted.$$state!==undefined){
            return posted.then(function(v){
                if(v.data.success){
                    tableService.refresh('victoryweekend.dates');
                    Notification(notifValues['added']($scope));
                } else{
                    vm.weekend.validation={"weekend_date":"required"};
                    notif.then(function(v){ v.kill(true); });
                }
            });
        }
    };
    vm.one2one={form:{}};
    vm.one2one.selectchapter=function(value){
        var data={chapterid:vm.one2one.form.chapterid};
        console.log(data);
        var posted=centralFctry.postData({url:'fetch/weekend_set/setchapter',data:data});
        if(posted.$$state!==undefined){
            posted.then(function(v){

            });
        }
    };
    function getdataform(){
        /*var posted=centralFctry.getData({ url:'fetch/one2one_get/chapters' });*/
        var posted=centralFctry.getData({ url:'fetch/settings_get/getdataform' });
        if(posted.$$state!==undefined){
            posted.then(function(v){

                vm.one2one.chapters=v.data.chapters;
                vm.one2one.form.chapterid=v.data.chapteractive;
            });
        }
    }
}]);