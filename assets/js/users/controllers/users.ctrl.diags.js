/**
 * Created by Actino-Dev on 1/14/2019.
 */
victory
    .controller('users.ctrl.diags.addfrm',['$scope','Notification','notifValues','centralFctry',function($scope,Notification,notifValues,centralFctry){
        var vm=this;
        $scope.form={type:'add'};
        $scope.required={};
        $scope.selected={center:{}};
        if($scope.data.userid!==undefined){
            getdata($scope.data.userid);
        }
        vm.save=function(form){
            var notiftype2='added',notifmessage='Adding...';
            if(form.type==='edit'){
                notiftype2='updated';notifmessage='Updating...';
            }
            var notif=Notification(notifValues['processing']({message:notifmessage},$scope));
            var posted=centralFctry.postData({ url:'fetch/users_set/create',data:form });
            if(posted.$$state!==undefined){
                return posted.then(function(v){
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
            $scope.required={email:'required',firstname:'required',lastname:'required',center:'required'};
        }
        function getdata($userid){
            var posted=centralFctry.getData({ url:'fetch/users_get/getusers/'+$userid });
            if(posted.$$state!==undefined){
                posted.then(function(v){
                    if(v.data!==undefined){
                        $scope.form={
                            userid:v.data.userid,
                            firstname:v.data.firstname,
                            lastname:v.data.lastname,
                            email:v.data.email
                        };
                        $scope.selected.center={id:v.data.centerid,name:v.data.centername};
                    }
                })
            }
        }
    }]);