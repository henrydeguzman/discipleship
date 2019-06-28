/**
 * Created by Actino-Dev on 4/13/2019.
 */
victory.controller('profile.page.controller',['$scope','pageService','pathValue','dialogs',function($scope,pageService,pathValue,dialogs){
    $scope.pathValue=pathValue;
    console.log(pathValue);
    $scope.form={};
    var vm=this,pagedata=pageService.response();
    vm.profile={loading:true};
    if(pagedata.$$state!==undefined){
        pagedata.then(function(v){
            console.log(v.data);
            $scope.profile=v.data;
            vm.profile.loading=false;
        });
    }

    vm.profile.updatediag=function(){
        dialogs.create({
            title:'Update Profile Picture',
            url:'page/loadview?dir=pages&view=profile/dialogs/choosephoto.html',
            options:{backdrop:'static',size:'lg',windowClass:'nomargin'},
            onclosed:function(v){
                if(v.result){

                }
            }
        })
    };

    vm.profile.upload=function(){
        console.log($scope.form);
        if($scope.form.file!==null){

        }
    };
}]);