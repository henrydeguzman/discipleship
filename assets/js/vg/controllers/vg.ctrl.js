/**
 * Created by Actino-Dev on 1/19/2019.
 */
victory.controller('vg.page.controller',['$scope','dialogs','centralFctry','Notification','notifValues','genvarsValue','$filter','tableService',function($scope,dialogs,centralFctry,Notification,notifValues,genvarsValue,$filter,tableService){
    var vm=this;
    vm.delete=function(tr){
        console.log('delete',tr);
        if(confirm("Are you sure?")){
            var posted=centralFctry.postData({url:'fetch/vg_set/set_vg',data:{userid:tr.userid,value:0}});
            if(posted.$$state!==undefined){
                posted.then(function(v){
                    if(v.data!==undefined&&v.data.success){
                        tableService.refresh('vg.memlist');
                    }
                })
            }
        }
    };
    vm.form={data:{}};
    vm.form.save=function(){
        var notif=Notification(notifValues['processing']({message:'Updating...'},$scope)),
            posted=centralFctry.postData({
            url:'fetch/vg_set/set_info ',data:vm.form.data
        });
        if(posted.$$state!==undefined){
            return posted.then(function(v){
                Notification(notifValues['doneupdating']($scope));
                console.log(v.data);
            });
        }
    };
    vm.form.dialog=function($id){
        console.log('fired',$id);
        var title='Add',data={fromctrl:'vg'};
        if($id!==undefined){
            title='Edit';data={userid:$id};
        }
        dialogs.create({
            title:title,
            url:'page/loadview?dir=pages&view=one2one/dialogs/add.html',
            options:{backdrop:'static',size:'md'},data:data,
            onclosed:function(v){
                if(v!==undefined){
                    if(v.querytype==='add'){
                        tableService.refresh('vg.memlist');
                    }
                    else if(v.querytype==='update'){
                        tableService.refreshrow('vg.memlist',$id,'userid');
                    }

                }
            }
        });
    };
    getdata();
    function getdata(){
        $date=$filter('date')(genvarsValue.curdate,genvarsValue.dateformat);
        var posted=centralFctry.getData({url:'fetch/vg_get/vginfo'});
        if(posted.$$state!==undefined){
            posted.then(function(v){
                var data=v.data;
                data['time']=$date+'T'+data['time'];
                vm.form.data=v.data;
            });
        }
    }
}]);