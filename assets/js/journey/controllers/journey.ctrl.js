/**
 * Created by Actino-Dev on 1/19/2019.
 */
victory.controller('journey.page.controller',['$scope','genvarsValue','$filter','centralFctry','$timeout',function($scope,genvarsValue,$filter,centralFctry,$timeout){
    var vm=this;
    getdata();
    vm.form={data:{}};
    vm.show={format:'MMM-dd-yyyy'};
    vm.show.trig=function(type){
        if(vm.show[type]){vm.show[type]=false;}else{vm.show[type]=true;}
    };
    vm.date={};
    vm.date.change=function(type){
        var form=angular.copy(vm.form.data);
        for (var key in form) {
            if(['userid','baptized'].indexOf(key)!==-1){continue;}
            if (form.hasOwnProperty(key)) {
                form[key]=$filter('date')(form[key],genvarsValue.dateformat+' '+genvarsValue.timeformat);
                if(form[key]=='Invalid Date'){ form[key]=undefined; }
            }
        }
        console.log(form);

        var posted=centralFctry.postData({url:'fetch/users_set/setjourney',data:form});
        if(posted.$$state!==undefined){
            posted.then(function(v){
                console.log(v.data);
            });
        }
    };
    function getdata(){
        var posted=centralFctry.getData({
            url:'fetch/users_set/getjourney'
        });
        if(posted.$$state!==undefined){
            posted.then(function(v){
                console.log(v.data);
                if(v.data===null){return;}
                vm.form.data['victory_weekend']=new Date(v.data.victory_weekend.replace(' ','T'));
                vm.form.data['church_community']=new Date(v.data.church_community.replace(' ','T'));
                vm.form.data['purple_book']=new Date(v.data.purple_book.replace(' ','T'));
                vm.form.data['making_disciples']=new Date(v.data.making_disciples.replace(' ','T'));
                vm.form.data['empowering_leaders']=new Date(v.data.empowering_leaders.replace(' ','T'));
                vm.form.data['leadership_113']=new Date(v.data.leadership_113.replace(' ','T'));
                vm.form.data['baptized']=v.data.baptized;
                console.log(vm.form.data);
            });
        }
    }
}]);