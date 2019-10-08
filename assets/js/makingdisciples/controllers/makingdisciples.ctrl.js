/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 08/10/2019
 * Time: 8:56 PM
 */
victory
    .controller('makingdisciples.page.controller',['$scope',function($scope){
        var vm=this;
        vm.tab={};
        vm.tab.change=function(tab,index,type,clicktype){
            console.log(tab,index,type,clicktype);
            if(clicktype!=='init') {
                $scope.broadcastEvent(index);
            }
        };
        $scope.broadcastEvent = function(_index) {
            if(_index===0){
                $scope.$broadcast('eventBctdmakingdisciples');
            }
        };
    }])
    .controller('makingdisciples.page.disciples.controller',['$scope','dialogs','tableService','centralFctry',function($scope,dialogs,tableService,centralFctry){
        var vm=this;
        vm.list={processing:true,data:{}};
        $scope.$on('eventBctdmakingdisciples', function(event, data) {
            getdata();
        });
        getdata();
        function getdata(fn){
            var get=centralFctry.getData({url:'fetch/makingdisciples_get/processdate'});
            if(get.$$state!==undefined){
                get.then(function(v){
                    console.log(v.data);
                    vm.list.processing=false;
                    vm.list.data=v.data;
                    if(fn!==undefined&&typeof(fn)==='function'){ fn(v); }
                });
            }
        }
        vm.date={};
        vm.date.create=function(){
            dialogs.create({
                title:'Add Making Disciples Date',
                url:'page/loadview?dir=pages&view=making_disciples/tabs/makingdisciplesdates/dialogs/adddates.html',options:{backdrop:'static',size:'sm'},
                onclosed:function(params){
                    if(params!==undefined&&params.success){
                        getdata();
                    }
                }
            });
        };
    }])
    .controller('makingdisciples.page.dates.controller',['$scope','dialogs','Notification','centralFctry','notifValues','tableService',function($scope,dialogs,Notification,centralFctry,notifValues,tableService){
        var vm=this;
        vm.disciples={date:{},validation:{}};
        vm.disciples.date.remove=function(tr){
            dialogs.confirm('Are you sure want to delete date: '+tr.date+' ?',function(){
                var notif=Notification(notifValues['processing']({message:"Deleting..."},$scope));
                var posted=centralFctry.postData({ url:'fetch/makingdisciples_set/remove',data:{id:tr.id} });
                if(posted.$$state!==undefined){
                    return posted.then(function(v){
                        console.log(v.data);
                        if(v.data.success){
                            Notification(notifValues['deleted']($scope));
                            tableService.refresh('makingdisciples.dates');
                        } else {
                            notif.then(function(v){ v.kill(true); });
                        }
                    });
                }
            });
        };
        vm.disciples.date.add=function(){
            dialogs.create({
                title:'Add Making Disciples Date',
                url:'page/loadview?dir=pages&view=making_disciples/tabs/makingdisciplesdates/dialogs/adddates.html',options:{backdrop:'static',size:'sm'},
                onclosed:function(params){
                    if(params!==undefined&&params.success){

                    }
                }
            })
        };
    }]);