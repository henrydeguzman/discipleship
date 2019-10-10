/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 07/10/2019
 * Time: 4:23 PM
 */
victory
    .controller('churchcommunity.page.controller',['$scope',function($scope){
        var vm=this;
        vm.tab={};
        vm.tab.change=function(tab,index,type,clicktype){
            if(clicktype!=='init') {
                $scope.broadcastEvent(index);
            }
        };
        $scope.broadcastEvent = function(_index) {
            if(_index===0){
                $scope.$broadcast('eventBctdCcommunity');
            }
        };
    }])
    .controller('churchcommunity.page.community.controller',['$scope','dialogs','tableService','centralFctry','spinnerValues',function($scope,dialogs,tableService,centralFctry,spinnerValues){
        var vm=this;
        vm.list={processing:true,data:{}};
        $scope.$on('eventBctdCcommunity', function(event, data) {
            getdata();
        });
        getdata();
        vm.markasdone={};
        vm.markasdone.check=function(type,data){
            if(type==='all'){
                for(var x=0;x<data.tr.length;x++){
                    data.tr[x]['_checked']=data.td.checkbox;
                }
            }
        };
        vm.markasdone.go=function(datas){
            var checked=[];
            for(var x=0;x<datas.length;x++){
                if(datas[x]['_checked']==true){
                    checked.push({ userid: datas[x]['userid'], weekendid:datas[x]['weekendid'],churchcommunityid:datas[x]['churchcommunityid']});
                }
            }
            if(checked.length===0){ dialogs.notify('Please select atleast one user to proceed.');return; }
            dialogs.confirm('Are you sure ?',function(){
                dialogs.asynchronous({
                    url:'page/loadview?dir=pages&view=church_community/tabs/churchcommunity/dialogs/markasdone.html',
                    model:'fetch/churchcommunity_set/markasdone',data:checked,
                    onclosed:function(){
                        tableService.refresh('churchcommunity.pre.list');
                        vm.list={processing:true};
                        getdata();
                        dialogs.notify('<table><tbody><tr>\n' +
                            '<td><i class="fa fa-check ng-scope" aria-hidden="true" style="font-size: 36px;padding-right: 10px;color: green;"></i></td>\n' +
                            '<td><span class="ng-scope">Process is complete!</span></td>\n' +
                            '</tr></tbody></table>');
                    }
                });
            });
        };
        function getdata(fn){
            var get=centralFctry.getData({url:'fetch/churchcommunity_get/processdate'});
            if(get.$$state!==undefined){
                get.then(function(v){
                    vm.list.processing=false;
                    vm.list.data=v.data;
                    if(fn!==undefined&&typeof(fn)==='function'){ fn(v); }
                });
            }
        }
        vm.date={};
        vm.date.create=function(){
            dialogs.create({
                title:'Add Church Community Date',
                url:'page/loadview?dir=pages&view=church_community/tabs/churchcommunitydates/dialogs/adddates.html',options:{backdrop:'static',size:'sm'},
                onclosed:function(params){
                    if(params!==undefined&&params.success){
                        getdata();
                    }
                }
            });
        };
    }])
    .controller('churchcommunity.page.dates.controller',['$scope','dialogs','Notification','centralFctry','notifValues','tableService',function($scope,dialogs,Notification,centralFctry,notifValues,tableService){
        var vm=this;
        vm.community={date:{},validation:{}};
        vm.community.date.remove=function(tr){
            dialogs.confirm('Are you sure want to delete date: '+tr.date+' ?',function(){
                var notif=Notification(notifValues['processing']({message:"Deleting..."},$scope));
                var posted=centralFctry.postData({ url:'fetch/churchcommunity_set/remove',data:{id:tr.id} });
                if(posted.$$state!==undefined){
                    return posted.then(function(v){

                        if(v.data.success){
                            Notification(notifValues['deleted']($scope));
                            tableService.refresh('churchcommunity.dates');
                        } else {
                            notif.then(function(v){ v.kill(true); });
                        }
                    });
                }
            });
        };
        vm.community.date.add=function(){
            dialogs.create({
                title:'Add Church Community Date',
                url:'page/loadview?dir=pages&view=church_community/tabs/churchcommunitydates/dialogs/adddates.html',options:{backdrop:'static',size:'sm'},
                onclosed:function(params){
                    if(params!==undefined&&params.success){

                    }
                }
            })
        };
    }]);