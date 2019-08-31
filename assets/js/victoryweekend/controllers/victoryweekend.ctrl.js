/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 26/07/2019
 * Time: 1:07 PM
 */
victory
    .controller('victoryweekend.page.controller',['$scope',function($scope){
        var vm=this;
        vm.tab={};
        vm.tab.change=function(a,b,c,d){

        };
    }])
    .controller('victoryweekend.page.weekend.controller',['$scope','dialogs','tableService','centralFctry','spinnerValues',function($scope,dialogs,tableService,centralFctry,spinnerValues){
        var vm=this;
        vm.list={processing:true};
        getdata();
        function getdata(){
            var get=centralFctry.getData({ url:'fetch/weekend_get/processdate' });
            if(get.$$state!==undefined){
                get.then(function(v){
                    vm.list.processing=false;
                    vm.list.data=v.data;
                });
            }
        }

        vm.email={};
        vm.email.add=function(tr,index){
            console.log(tr,index);
            dialogs.create({
                url:'page/loadview?dir=pages&view=victory_weekend/tabs/vweekend/dialogs/addemail.html',
                title:'Add email',
                options:{backdrop:'static',size:'sm'},data:{tr:tr,index:index},
                onclosed:function(params){
                    if(params!==undefined&&params.success){
                        tableService.refreshrow('vweekend.pre.list',tr.id);
                    }
                }
            });
        };
        vm.create={};
        vm.create.check=function(type,data){
            if(type==='all'){
                var noemail=0;
                for(var x=0;x<data.tr.length;x++){
                    if(data.tr[x].email!==null&&data.tr[x].email!==''&&data.tr[x].email!==undefined){
                        data.tr[x]['_checked']=data.td.checkbox;
                    } else { noemail++; }
                }
                if(data.td.checkbox&&data.td.checkbox&&noemail>0){
                    dialogs.notify('There are '+noemail+' records that have no email, Please fill their email to send them email about there credentials. If you wish to continue, syterm will not create their account, Thank you.');
                }
            }
            else{
                if(tr.email==null&&tr._checked){
                    tr._checked=false;
                    dialogs.notify('Please add email on #'+(index+1)+' to continue.');
                }
            }
        };
        vm.create.accounts=function(datas){
            var checked=_.filter(datas,{_checked:true});
            console.log(checked.length,checked);
            if(checked.length===0){ dialogs.notify('Please select atleast one user to create account.');return; }
            dialogs.confirm('Are you sure ?',function(){
                dialogs.asynchronous({
                    url:'page/loadview?dir=pages&view=victory_weekend/tabs/vweekend/dialogs/create-accounts.html',
                    model:'fetch/weekend_set/createaccnt',data:checked,
                    onclosed:function(){
                        tableService.refresh('vweekend.pre.list');
                        dialogs.notify('<table><tbody><tr>\n' +
                            '<td><i class="fa fa-check ng-scope" aria-hidden="true" style="font-size: 36px;padding-right: 10px;color: green;"></i></td>\n' +
                            '<td><span class="ng-scope">Creating accounts and sending emails is complete!</span></td>\n' +
                            '</tr></tbody></table>');
                    }
                });
            });
        };
    }])
    .controller('victoryweekend.page.dates.controller',['$scope','tableService','Notification','notifValues','centralFctry','dialogs',function($scope,tableService,Notification,notifValues,centralFctry,dialogs){
        var vm=this;
        vm.weekend={date:{},validation:{}};
        vm.weekend.date.remove=function(tr){
            dialogs.confirm('Are you sure want to delete date: '+tr.date+' ?',function(){
                var notif=Notification(notifValues['processing']({message:"Deleting..."},$scope));
                var posted=centralFctry.postData({ url:'fetch/weekend_set/remove',data:{id:tr.id} });
                if(posted.$$state!==undefined){
                    return posted.then(function(v){
                        if(v.data.success){
                            Notification(notifValues['deleted']($scope));
                            tableService.refresh('victoryweekend.dates');
                        } else {
                            notif.then(function(v){ v.kill(true); });
                        }
                    });
                }
            });
        };
        vm.weekend.date.add=function(){
            dialogs.create({
                title:'Add victory weekend date',
                url:'page/loadview?dir=pages&view=victory_weekend/tabs/vweekenddates/dialogs/adddates.html',options:{backdrop:'static',size:'sm'},
                onclosed:function(params){
                    if(params!==undefined&&params.success){

                    }
                }
            })
        }
    }])
    .controller('victoryweekend.page.settings.controller',['$scope','centralFctry','genvarsValue','$filter',function($scope,centralFctry,genvarsValue,$filter){
        var vm=this;
        getdataform();


        vm.one2one={form:{}};
        vm.one2one.selectchapter=function(value){
            var data={chapterid:vm.one2one.form.chapterid};
            console.log(data);
            var posted=centralFctry.postData({url:'fetch/weekend_set/setchapter',data:data});
            if(posted.$$state!==undefined){
                posted.then(function(v){
                    console.log(v.data);
                });
            }
        };
        function getdataform(){
            /*var posted=centralFctry.getData({ url:'fetch/one2one_get/chapters' });*/
            var posted=centralFctry.getData({ url:'fetch/settings_get/getdataform' });
            if(posted.$$state!==undefined){
                posted.then(function(v){
                    console.log(v.data);
                    vm.one2one.chapters=v.data.chapters;
                    vm.one2one.form.chapterid=v.data.chapteractive;
                });
            }
        }
    }]);