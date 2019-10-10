/**
 * Created by Actino-Dev on 1/19/2019.
 */
victory.controller('one2one.page.controller',['$scope','dialogs','tableService','centralFctry',function($scope,dialogs,tableService,centralFctry){
    var vm=this;
    $scope.form={};
    vm.addtovg=function(value,node){
        var posted=centralFctry.postData({url:'fetch/vg_set/set_vg',data:{userid:node.userid,value:value}});
        if(posted.$$state!==undefined){
            posted.then(function(v){

            })
        }
    };
    vm.chapter=function(tr){
        var posted=centralFctry.postData({url:'fetch/one2one_set/add',data:{o2oid:tr.o2oid,chapter:tr.chapter}});
        if(posted.$$state!==undefined){
            posted.then(function(v){

            });
        }
    };
    vm.form={};
    vm.form.dialog=function($data){
        var title='Add',data={fromctrl:'one2one'};
        if($data!==undefined&&$data.o2oid!==undefined){
            title='Edit';data=$data;
        }
        dialogs.create({
            title:title,
            url:'page/loadview?dir=pages&view=one2one/dialogs/add.html',
            options:{backdrop:'static',size:'md'},data:data,
            onclosed:function(v){
                if(v!==undefined){
                    if(v.querytype==='add'){
                        tableService.refresh('one2one.memlist');
                    }
                    else if(v.querytype==='update'){
                        tableService.refreshrow('one2one.memlist',$data.userid,'userid');
                    }

                }
            }
        });
    }
}]);