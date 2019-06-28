/**
 * Created by Actino-Dev on 12/28/2018.
 */
victory
    .controller('admin.centers.page.controller',['dialogs','tableService',function(dialogs,tableService){
        var vm=this;
        vm.form={};
        vm.form.dialog=function($id){
            var title='Add',data={};
            if($id!==undefined){
                title='Edit';data={id:$id};
            }
            dialogs.create({
                title:title,
                url:'page/loadview?dir=pages&view=admin/dialogs/centers/centers.html',
                options:{backdrop:'static',size:'sm'},data:data,
                onclosed:function(v){
                    if(v!==undefined){
                        if(v.querytype==='add'){
                            tableService.refresh('centers.tablelist');
                        }
                        else if(v.querytype==='update'){
                            tableService.refreshrow('centers.tablelist',$id);
                        }
                    }

                }
            });
        };
    }]);