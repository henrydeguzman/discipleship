/**
 * Created by Actino-Dev on 11/24/2018.
 */
var victory=angular.module('app',['ui.bootstrap','ui.router','MainDirectives','MainControllers','MainFactories','MainValues','MainFilters','dialogs.main','ui-notification',"MainFormatters","mwl.calendar"]);
victory.run(['$rootScope','centralFctry',function($rootScope,centralFctry){
    /*var posted=centralFctry.getData({url:'fetch/app/init'});
    if(posted.$$state!==undefined){
        posted.then(function(v){
            $rootScope.data=v.data;
        });
    }*/
}]);