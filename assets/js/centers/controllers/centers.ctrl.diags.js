/**
 * Created by Actino-Dev on 12/28/2018.
 */
victory
    .controller('centers.ctrl.diags.addfrm',['$scope','Notification','notifValues','centralFctry',function($scope,Notification,notifValues,centralFctry){
        var vm=this;
        $scope.form={type:'add'};
        $scope.required={};
        if($scope.data!==undefined&&$scope.data.id!==undefined){
            console.log($scope.data.id);
            getdata($scope.data.id);
        }
        vm.save=function(form){
            console.log(form);
            var notiftype2='added',notifmessage='Adding...';
            if(form.type==='edit'){
                notiftype2='updated';notifmessage='Updating...';
            }
            var notif=Notification(notifValues['processing']({message:notifmessage},$scope));
            var posted=centralFctry.postData({ url:'fetch/centers_set/create',data:form });
            if(posted.$$state!==undefined){
                return posted.then(function(v){
                    if(v.data.success){
                        $scope.$parent.close(v.data);
                        Notification(notifValues[notiftype2]($scope));
                    } else {
                        if(v.data.error!==undefined&&v.data.error.code!==0){ alert(JSON.stringify(v.data.error)); }
                        notif.then(function(v){ v.kill(true); });
                        required();
                    }
                });
            }
        };
        function required(){
            $scope.required={name:'required',location:'required'};
        }
        function getdata($churchid){
            var posted=centralFctry.getData({
                url:'fetch/centers_get/getlist/'+$churchid
            });
            if(posted.$$state!==undefined){
                posted.then(function(v){
                    if(v.data!==undefined){
                        $scope.form={
                            id:v.data.id,
                            name:v.data.name,
                            location:v.data.location,
                            type:'edit'
                        };
                    }
                });
            }
        }
    }]);