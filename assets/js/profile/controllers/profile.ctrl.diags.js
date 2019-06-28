/**
 * Created by PhpStorm
 * User : Henrilics
 * Date : 2019-05-10
 * Time : 21:25
 */
victory
    .controller('profile.ctrl.diags.uploader',['$scope','centralFctry',function($scope,centralFctry){
        var vm=this;
        console.log($scope.data);

        $scope.upload={};
        upload1($scope.data);
        function upload1(data){
            var posted=centralFctry.uploadfile({
                url:'fetch/profile_set/uploadphoto',data:data
            });
        }
        function upload(data){
            var posted=centralFctry.postData({
                url:"fetch/profile_set/uploadphoto",data:data,serializer:'jqlike'
            });
            if(posted.$$state!==undefined){
                posted.then(function(v){
                    console.log(v.data);
                    /*if(v.data.result){
                        $scope.$parent.close(v.data);
                    }*/
                });
            }
        }
    }])
    .controller('profile.ctrl.diags.choosephoto',['$scope','mimeTypes','centralFctry','dialogs','$timeout',function($scope,mimeTypes,centralFctry,dialogs,$timeout){
        var vm=this;
        $scope.mimeTypes=mimeTypes;
        $scope.form={};
        /*
        * Uploading stat
        * 0=unset,1=start,2=done,*/
        $scope.profile={upload:{status:0}};
        $scope.profile.upload.process=function(file){
            var posted=centralFctry.uploadfile({
                url:'fetch/profile_set/uploadphoto',data:
                    {
                        file:file,
                        onloadend:function(e){

                        },
                        onloadstart:function(e){

                                $scope.profile.upload.status=1;
                        },
                        onreadystatechange:function(xhr,v){
                            $scope.$apply(function(){
                                if (xhr.readyState == 3) {
                                    // loading
                                }
                                if (xhr.readyState == 4) {
                                    $timeout(function(){
                                        $scope.profile.upload.status=2;
                                        $scope.$parent.close(v);
                                        console.log('response stathe:', v); // JSON response
                                    },1000);

                                }
                            });
                        },
                        onprogress:function(e){
                            $scope.$apply(function(){
                                console.log(e);
                                console.log(e.loaded+  " / " + e.total);
                                var percentComplete = Math.round(e.loaded * 100 / e.total);
                                $scope.profile.upload.value=percentComplete;
                                $scope.profile.upload.style={'width':percentComplete+'%'};
                                console.log($scope.profile.upload);
                            });
                        }
                    }
            });
        };
        vm.preparing=function(data){
            console.log(data);
            dialogs.create({
                url:'page/loadview?dir=pages&view=profile/dialogs/uploader.html',
                options:{backdrop:'static',size:'lg',windowClass:'nomargin'},data:data,
                onclosed:function(v){
                    if(v.result){ $scope.$parent.close(v); }
                }
            });
        };
    }]);
