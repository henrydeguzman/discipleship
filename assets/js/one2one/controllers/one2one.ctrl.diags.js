/**
 * Created by Actino-Dev on 1/19/2019.
 */
victory.controller('one2one.ctrl.diags.addfrm',['$scope','Notification','notifValues','centralFctry','tableService','genvarsValue',function($scope,Notification,notifValues,centralFctry,tableService,genvarsValue){
    var vm=this;
    console.log($scope.data);
    $scope.form={type:'add',ismember:0};
    $scope.required={};
    $scope.selected={center:{}};
    console.log($scope.data);
    if($scope.data!==undefined){
        $scope.form.frmctrl=$scope.data.fromctrl;
        console.log($scope.data);
        if($scope.data.userid!==undefined){
            getdata($scope.data.userid);
        }
    }
    vm.addtoone2one=function(tr){
        var userdata=genvarsValue.userdata();
        var posted=centralFctry.postData({url:'fetch/one2one_set/add',data:{o2oid:tr.o2oid,userid:tr.userid,leaderid:userdata.userid}});
        if(posted.$$state!==undefined){
            posted.then(function(v){
                console.log(v.data);
            });
        }
    };
    vm.addtovg=function(tr){
        console.log(tr);
        var posted=centralFctry.postData({url:'fetch/vg_set/set_vg',data:{userid:tr.userid,value:1}});
        if(posted.$$state!==undefined){
            posted.then(function(v){
                console.log(v.data);
                if(v.data!==undefined&&v.data.success){
                    if($scope.data.fromctrl=='vg'){
                        tableService.refresh('vg.memlist');
                    }
                    tableService.refresh('users.novg');
                }
            })
        }
    };
    vm.save=function(form){
        console.log(form);
        var notiftype2='added',notifmessage='Adding...';
        if(form.type==='edit'){
            notiftype2='updated';notifmessage='Updating...';
        }
        var notif=Notification(notifValues['processing']({message:notifmessage},$scope));
        //return;
        var posted=centralFctry.postData({ url:'fetch/one2one_set/create',data:form });
        if(posted.$$state!==undefined){
            return posted.then(function(v){
                console.log(v.data);
                if(v.data.success){
                    $scope.$parent.close(v.data);
                    Notification(notifValues[notiftype2]($scope));
                } else {
                    if(v.data.error!==undefined&&v.data.error.code!==0){ alert(JSON.stringify(v.data.error)); }
                    required();
                    notif.then(function(v){ v.kill(true); });
                }
            });
        }
    };
    function required(){
        $scope.required={center:'required',address:'required',firstname:'required',lastname:'required',contact:'required'};
    }
    function getdata(userid){
        var posted=centralFctry.getData({
            url:'fetch/one2one_get/getuser/'+userid
        });
        if(posted.$$state!==undefined){
            posted.then(function(v){
                console.log(v.data);
                if(v.data!==undefined){
                    $scope.form.userid=v.data.userid;
                    $scope.form.firstname=v.data.firstname;
                    $scope.form.lastname=v.data.lastname;
                    $scope.form.phonenumber=v.data.phonenumber;
                    $scope.form.address=v.data.address;
                    $scope.form.type='edit';
                }
            });
        }
    }
}]);