/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 26/07/2019
 * Time: 1:07 PM
 */
victory
    .controller('victoryweekend.page.controller',['$scope',function($scope){
        var vm=this;
    }])
    .controller('victoryweekend.page.weekend.controller',['$scope','dialogs',function($scope,dialogs){
        var vm=this;
        vm.create={};
        vm.create.accounts=function(){
            console.log('fired');
            dialogs.create({
                type:'confirm',url:'page/loadview?dir=pages&view=victory_weekend/tabs/vweekend/dialogs/create-accounts.html',
                options:{backdrop:'static',keyboard:false},data:{confirm:'really ?'},
                onclosed:function(params){
                    if(params){
                        console.log('confirm yes');
                    }
                    else{
                        console.log('confirm no');
                    }
                }
            });
        };
    }])
    .controller('victoryweekend.page.settings.controller',['$scope','centralFctry','genvarsValue','$filter','tableService','Notification','notifValues',function($scope,centralFctry,genvarsValue,$filter,tableService,Notification,notifValues){
        var vm=this;
        getdataform();
        $scope.curdate=$filter('date')(genvarsValue.curdate,genvarsValue.dateformat);
        vm.weekend={date:{format:'MMM-dd-yyyy'},validation:{}};
        vm.weekend.remove=function(tr){
            var notif=Notification(notifValues['processing']({message:"Deleting..."},$scope));
            if(confirm('Are you sure want to delete date: '+tr.date+' ?')){
                var posted=centralFctry.postData({ url:'fetch/weekend_set/remove',data:{weekend_dateid:tr.weekend_dateid} });
                if(posted.$$state!==undefined){
                    return posted.then(function(v){
                        if(v.data.success){
                            Notification(notifValues['deleted']($scope));
                            tableService.refresh('victoryweekend.dates');
                        } else {
                            notif.then(function(v){ v.kill(true); });
                        }
                    });
                }
            } else {
                notif.then(function(v){ v.kill(true); });
            }
        };
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
        vm.weekend.date.trig=function(){ vm.weekend.date.show?vm.weekend.date.show=false:vm.weekend.date.show=true; };
        vm.one2one={form:{}};
        vm.one2one.selectchapter=function(value){
            var data={chapterid:vm.one2one.form.chapterid};
            console.log(data);
            var posted=centralFctry.postData({url:'fetch/weekend_set/setchapter',data:data});
            if(posted.$$state!==undefined){
                posted.then(function(v){
                    console.log(v.data);
                });
            }
        };
        function getdataform(){
            /*var posted=centralFctry.getData({ url:'fetch/one2one_get/chapters' });*/
            var posted=centralFctry.getData({ url:'fetch/settings_get/getdataform' });
            if(posted.$$state!==undefined){
                posted.then(function(v){
                    console.log(v.data);
                    vm.one2one.chapters=v.data.chapters;
                    vm.one2one.form.chapterid=v.data.chapteractive;
                });
            }
        }
    }]);