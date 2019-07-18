/**
 * Created by Actino-Dev on 1/19/2019.
 */
victory
    .config(['$logProvider','$stateProvider','$urlRouterProvider',function($logProvider,$stateProvider,$urlRouterProvider){
        $stateProvider
            .state('sref_sidebar',{
                url:'/{tab}/{name}',
                resolve: {
                    getdata:function($stateParams,pageService){
                        return pageService.getdata($stateParams);
                    }
                },
                views:{
                    "vwsidetab":{
                        templateUrl:function(stateParams){
                            var f=stateParams.tab.split(';'),path=stateParams.tab+"/"+stateParams.tab+".html";
                            if(f.length>1){ path=f.join("/")+'.html'; }
                            return "page/loadview?view="+path;
                        },controller:function(getdata,pageService,$stateParams){ pageService.setdata(getdata[$stateParams.tab]); }
                    }
                }
            });
        $urlRouterProvider.otherwise('dashboard');
    }])
    .config(function(NotificationProvider){
        NotificationProvider.setOptions({
            startTop: 20,
            startRight: 20,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'bottom',
            templateUrl:"page/loadview?dir=jshtml&view=notifications/growl/growl.html"
        });
    });