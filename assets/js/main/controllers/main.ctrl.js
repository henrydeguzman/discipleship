/**
 * Created by Actino-Dev on 11/24/2018.
 */
angular.module('MainControllers',[])
    .provider('globalsetting', function () {
        var appname = "LAWYER APP";
        this.setAppName = function (value) {
            appname = value;
        }
        this.$get = function () {
            return {
                appName: appname
            };
        }
    })
    .controller('appmain.controller',['$scope','genvarsValue','pathValue','spinnerValues','isloadingService',function($scope,genvarsValue,pathValue,spinnerValues,isloadingService){
        var vm=this;
        /** declare global variables */
        vm.userdata=genvarsValue.userdata();
        $scope.genvarsValue=genvarsValue;
        $scope.pathValue=pathValue;
        $scope.spinnerValues=spinnerValues;
        $scope.isloadingService=isloadingService;
    }])
    .controller('main.header.controller',['centralFctry',function(centralFctry){
        var vm=this;
    }])
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
    .controller('main.resetpassword.controller',['$scope','centralFctry',function($scope,centralFctry){
        var vm=this;
        $scope.form={};
        $scope.required={};
        vm.message={info:undefined,color:false};
        vm.back=function(){};
        vm.verify=function(form){
            console.log(form);
            var posted=centralFctry.postData({ url:'fetch/users_connection/reset_password',data:form });
            if(posted.$$state!==undefined){
                return posted.then(function(v){
                    console.log(v.data);
                    // if(v.data.success){
                    //     vm.message.info=v.data.info;vm.message.color='green';
                    //     location.reload();
                    // } else {
                    //     required();
                    //     vm.message.info=v.data.info;
                    //     vm.message.color='red';
                    // }
                    if(!v.data.success){
                        required();
                        vm.message.info=v.data.info;
                        vm.message.color='red';
                    } else {
                        location.assign(v.data.info+'page/auth/link-sent');
                    }
                });
            }
        };
        function required(){
            $scope.required={email:'required'};
        }
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