/**
 * Created by Actino-Dev on 1/19/2019.
 */
victory
    .controller('vg.page.othrvg.controller',['$scope','centralFctry','genvarsValue',function($scope,centralFctry,genvarsValue){
        var vm=this;vm.content={list:[],info:[]};
        $scope.genvarsValue=genvarsValue;
        getdata("getothrvgs");
        vm.getinfo=function(key,list){
            console.log(list);
            getdata('getinfo',{vgid:list.vgid,key:key})
        };
        function getdata(type,params){
            var url='';
            switch (type) {
                case "getothrvgs":
                    url='fetch/vg_get/getothrvgs';
                    break;
                case "getinfo":
                    url="fetch/vg_get/vginfo/"+params.vgid;
                    break;
            }
            var get=centralFctry.getData({url:url});
            if(get.$$state!==undefined){
                get.then(function(v){
                    switch (type) {
                        case "getothrvgs":
                            vm.content.list=v.data;
                            break;
                        case "getinfo":
                            vm.content.info[params.key]=v.data;
                            break;
                    }
                })
            }
        }
    }])
    .controller('vg.page.myvg.controller',['$scope','dialogs','centralFctry','Notification','notifValues','genvarsValue','$filter','tableService',function($scope,dialogs,centralFctry,Notification,notifValues,genvarsValue,$filter,tableService){
        var vm=this;
        $scope.genvarsValue=genvarsValue;
        vm.delete=function(tr){
            dialogs.confirm('Are you sure ?',function(){
                var posted=centralFctry.postData({url:'fetch/vg_set/set_vg',data:{userid:tr.userid,value:0}});
                if(posted.$$state!==undefined){
                    posted.then(function(v){
                        if(v.data!==undefined&&v.data.success){
                            tableService.refresh('vg.memlist');
                        }
                    })
                }
            });
        };
        vm.addtointern=function(value,node){
            dialogs.confirm('Are you sure ?',function(){
                var data={value:value,vgid:node.vgid,internid:node.internid,userid:node.userid};
                var posted=centralFctry.postData({ url:'fetch/vg_intern/set', data:data });
                if(posted.$$state!==undefined){
                    posted.then(function(v){
                        centralFctry.dialoghandler(v);
                        if(v.data.success){ node.internid=v.data.lastid; } else { node.isintern=value==0?1:0; }
                    });
                }
            },function(){ node.isintern=value==0?1:0; });
        };
        vm.form={data:{}};
        vm.form.save=function(){
            var notif=Notification(notifValues['processing']({message:'Updating...'},$scope)),
                posted=centralFctry.postData({ url:'fetch/vg_set/set_info ',data:vm.form.data });
            if(posted.$$state!==undefined){
                return posted.then(function(v){
                    Notification(notifValues['updated']($scope));
                    console.log(v.data);
                    if(v.data.success){
                        tableService.refresh('vg.memlist');
                    }
                });
            }
        };
        vm.form.dialog=function($id){
            console.log('fired',typeof $id);
            var title='Add',data={fromctrl:'vg'};
            if(typeof($id)==='string'){
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
                    console.log(v.data);
                    var data=v.data;
                    if(v.data!==null){
                        data['time']=$date+'T'+data['time'];
                    }
                    vm.form.data=v.data;
                });
            }
        }
    }]);