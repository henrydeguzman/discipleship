/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 04/10/2019
 * Time: 12:26 PM
 */
victory.controller('translation.page.controller',['$scope','dialogs',function($scope,dialogs){
    var vm=this;
    vm.translation={};
    vm.translation.form=function(a){
        dialogs.create({
            url:'page/loadview?dir=pages&view=translation/dialogs/translationform.html',
            options:{backdrop:'static',size:'md'},
            onclosed:function(v){
                console.log(v);
            }
        })
    };
}]);