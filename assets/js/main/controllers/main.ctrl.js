/**
 * Created by Actino-Dev on 11/24/2018.
 */
angular.module('MainControllers',[])
    .controller('appmain.controller',['$scope','genvarsValue','pathValue','spinnerValues','isloadingService',function($scope,genvarsValue,pathValue,spinnerValues,isloadingService){
        var vm=this;
        /** declare global variables */
        vm.userdata=genvarsValue.userdata();
        $scope.genvarsValue=genvarsValue;
        $scope.pathValue=pathValue;
        $scope.spinnerValues=spinnerValues;
        $scope.isloadingService=isloadingService;
    }])
    .controller('main.header.controller',['centralFctry',function(centralFctry){ var vm=this; }])
    .controller('main.login.controller',['$scope','centralFctry',function($scope,centralFctry){
        var vm=this;
        $scope.form={};
        $scope.required={};
        vm.message={info:undefined,color:false};
        vm.verify=function(form){
            console.log(form);
            var posted=centralFctry.postData({ url:'fetch/users_connection/verify',data:form });
            if(posted.$$state!==undefined){
                return posted.then(function(v){
                    if(v.data.success){
                        vm.message.info=v.data.info;vm.message.color='green';
                        location.reload();
                    } else {
                        required();
                        vm.message.info=v.data.info;
                        vm.message.color='red';
                        $scope.form.password="";
                    }
                });
            }
        };
        function required(){
            $scope.required={email:'required',password:'required'};
        }
    }])
    .controller('main.resetpassword.controller',['$scope','centralFctry','glfnc',function($scope,centralFctry,glfnc){
        var vm=this;
        $scope.form={};
        $scope.required={};
        vm.recover={};
        vm.recover.required=function(){ $scope.required={password:'required',confirm:'required'}; };
        vm.recover.submit=function(userid,token){
            //console.log('fired',userid,token);
            if($scope.form.password===undefined||$scope.form.confirm===undefined){vm.recover.required();}
            if($scope.form.password!==$scope.form.confirm&&$scope.form.password!==undefined&&$scope.form.confirm!==undefined&&glfnc.trim($scope.form.password)!==""&&glfnc.trim($scope.form.confirm)!==""){
                vm.recover.success=false;vm.recover.info="Confirm password does not match!";
                $scope.form.password=undefined;$scope.form.confirm=undefined;$scope.required={};return;
            }
            $scope.form.token=token;$scope.form.userid=userid;
            var posted=centralFctry.postData({ url:'fetch/users_connection/recover', data:$scope.form });
            if(posted.$$state!==undefined){
                posted.then(function(v){
                    console.log(v.data);
                    if(v.data.success){
                        location.assign(vtr.pathValue.base_url+'page/auth/reset-success');
                    }
                    else {
                        vm.recover.success=v.data.success;vm.recover.info=v.data.info;
                        vm.recover.required();
                    }
                });
            }
        };
        vm.verify=function(form){
            console.log(form);
            var posted=centralFctry.postData({ url:'fetch/users_connection/reset_password',data:form });
            if(posted.$$state!==undefined){
                return posted.then(function(v){
                    console.log(v.data);
                    if(!v.data.success){ required(); vm.message.info=v.data.info; vm.message.color='red'; }
                    else { location.assign(v.data.info+'page/auth/link-sent'); }
                });
            }
        };
        function required(){ $scope.required={email:'required'}; }
    }])
    .controller('main.sidebar.controller',['$stateParams','$scope',function($stateParams,$scope){
        var vm=this;
        $scope.stateparams=$stateParams;
    }])
    .controller('main.breadcrumb.controller',['$stateParams','$scope',function($stateParams,$scope){
        var vm=this;
        $scope.stateparams=$stateParams;
            $scope.$watch('stateparams.name',function(n,o){
            if(n!==undefined){
                $scope.tab=n.split(';');
            }
        });
    }]);