/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 11/10/2019
 * Time: 9:43 PM
 */
victory
    .controller('empleaders.page.controller',[function(){

    }])
    .controller('empleaders.page.disciples.controller',['$scope','dialogs','Notification','centralFctry','notifValues','tableService',function($scope,dialogs,Notification,centralFctry,notifValues,tableService){
        var vm=this;
        vm.list={processing:true,data:{}};
        $scope.$on('eventBctdempleaders', function(event, data) {
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
                    checked.push({ userid: datas[x]['userid'], makingdisciplesid:datas[x]['makingdisciplesid'],empleadersid:datas[x]['empleadersid']});
                }
            }
            if(checked.length===0){ dialogs.notify('Please select atleast one user to proceed.');return; }
            dialogs.confirm('Are you sure ?',function(){
                dialogs.asynchronous({
                    url:'page/loadview?dir=pages&view=empowering_leaders/tabs/empleaders/dialogs/markasdone.html',
                    model:'fetch/empleaders_set/markasdone',data:checked,
                    onclosed:function(){
                        tableService.refresh('makingdisciples.pre.list');
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
            var get=centralFctry.getData({url:'fetch/empleaders_get/processdate'});
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
                title:'Add Empowering Leaders Date',
                url:'page/loadview?dir=pages&view=empowering_leaders/tabs/empleadersdates/dialogs/adddates.html',options:{backdrop:'static',size:'sm'},
                onclosed:function(params){
                    if(params!==undefined&&params.success){
                        getdata();
                    }
                }
            });
        };
    }])
    .controller('empleaders.page.dates.controller',['$scope','dialogs','Notification','centralFctry','notifValues','tableService',function($scope,dialogs,Notification,centralFctry,notifValues,tableService){
        var vm=this;
        vm.leaders={date:{},validation:{}};
        vm.leaders.date.remove=function(tr){
            dialogs.confirm('Are you sure want to delete date: '+tr.date+' ?',function(){
                var notif=Notification(notifValues['processing']({message:"Deleting..."},$scope));
                var posted=centralFctry.postData({ url:'fetch/empleaders_set/remove',data:{id:tr.id} });
                if(posted.$$state!==undefined){
                    return posted.then(function(v){
                        if(v.data.success){
                            Notification(notifValues['deleted']($scope));
                            tableService.refresh('empleaders.dates');
                        } else {
                            notif.then(function(v){ v.kill(true); });
                        }
                    });
                }
            });
        };
        vm.leaders.date.add=function(){
            dialogs.create({
                title:'Add Empowering Leaders Date',
                url:'page/loadview?dir=pages&view=empowering_leaders/tabs/empleadersdates/dialogs/adddates.html',options:{backdrop:'static',size:'sm'},
                onclosed:function(params){
                    if(params!==undefined&&params.success){

                    }
                }
            })
        };
    }]);